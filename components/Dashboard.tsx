"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Wallet, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import TransactionForm from "./TransactionForm";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Timestamp;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addTransaction = async (data: any) => {
    await addDoc(collection(db, "transactions"), {
      ...data,
      date: Timestamp.now()
    });
  };

  const deleteTransaction = async (id: string) => {
    await deleteDoc(doc(db, "transactions", id));
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryData = transactions
    .filter(t => t.type === "expense")
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const sortedTransactions = [...transactions].sort((a, b) => a.date.toMillis() - b.date.toMillis());
  const flowData = sortedTransactions.map((t, idx) => ({
    name: t.date.toDate().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    amount: t.type === "income" ? t.amount : -t.amount,
    balance: sortedTransactions
      .slice(0, idx + 1)
      .reduce((acc, curr) => acc + (curr.type === "income" ? curr.amount : -curr.amount), 0),
    label: t.description || t.category
  }));

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
          <p className="text-slate-400">Cloud-based personal finance manager</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-xl">
            <span className="text-xs text-slate-400 block">Total Balance</span>
            <span className={`text-xl font-bold ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              ₹{balance.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
            <Wallet size={24} />
          </div>
          <div>
            <span className="text-sm text-slate-400">Total Balance</span>
            <div className="text-2xl font-bold">₹{balance.toLocaleString()}</div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-sm text-slate-400">Income</span>
            <div className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
            <TrendingDown size={24} />
          </div>
          <div>
            <span className="text-sm text-slate-400">Expenses</span>
            <div className="text-2xl font-bold text-red-400">-₹{totalExpense.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TransactionForm onAdd={addTransaction} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl h-[300px]">
              <h3 className="text-sm font-medium text-slate-400 mb-4">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f8fafc" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="glass p-6 rounded-2xl h-[300px]">
              <h3 className="text-sm font-medium text-slate-400 mb-4">Detailed Cash Flow (Bar Graph)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={flowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f8fafc" }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {flowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.amount > 0 ? "#10b981" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-800/50">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-slate-800 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-500">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No transactions found. Start by adding one!</div>
              ) : (
                transactions.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${t.type === "income" ? "bg-emerald-500" : "bg-red-500"}`} />
                      <div>
                        <div className="font-medium text-slate-200">{t.description || t.category}</div>
                        <div className="text-xs text-slate-500">{t.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className={`font-semibold ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </div>
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
