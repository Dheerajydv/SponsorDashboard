"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Trash2 } from "lucide-react";
import { set } from "mongoose";
import axios from "axios";

interface Sponsor {
  _id: string;
  sponsorName: string;
  businessType: string;
  location: string;
  assignedTeam: string;
  amount: string;
}

export default function Dashboard() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    sponsorName: "",
    businessType: "",
    location: "",
    assignedTeam: "",
    amount: "",
  });

  const fetchSponsors = async () => {
  try {
    setIsLoading(true);
    const response = await axios.get("/api/get-sponsors");

    if (response.data.success) {
      setSponsors(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching sponsors:", error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchSponsors();
}, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: any) => {
  try {
    setIsLoading(true);

    const response = await axios.delete(`/api/sponsors/${id}`);

    await fetchSponsors(); // 🔥 Refetch after delete
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = async (e: any) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const newSponsor = {
      name: formData.sponsorName,
      businessType: formData.businessType,
      location: formData.location,
      teamAssigned: formData.assignedTeam,
      amount: Number(formData.amount),
    };

    const response = await axios.post("/api/add-sponsor", newSponsor);
    console.log(response)

    await fetchSponsors();

    setFormData({
      sponsorName: "",
      businessType: "",
      location: "",
      assignedTeam: "",
      amount: "",
    });

    setIsOpen(false);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  // 🔹 Calculate Total Amount
  const totalAmount = useMemo(() => {
    return sponsors.reduce((sum, sponsor) => {
      const numericValue = Number(
        sponsor.amount
      );
      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
  }, [sponsors]);

  const formattedTotal = `₹${totalAmount.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen w-screen bg-black text-white p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
            IMMERSE 2026
          </h1>
          <p className="text-gray-400">Sponsor Tracking Dashboard</p>
          <p className="text-lg sm:text-xl font-semibold text-blue-400">
            Total Funds: {formattedTotal}
          </p>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> Add Sponsor
        </Button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-blue-500/40 rounded-2xl w-full max-w-md"
            >
              <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold">Add Sponsor</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <Input
                  name="sponsorName"
                  placeholder="Sponsor Name"
                  value={formData.sponsorName}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="businessType"
                  placeholder="Business Type"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="assignedTeam"
                  placeholder="Assigned Team"
                  value={formData.assignedTeam}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="amount"
                  placeholder="Amount (₹)"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Save Sponsor
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sponsor List */}
      <div className="grid gap-4">
        {sponsors.map((sponsor) => (
          <Card
            key={sponsor?._id}
            className="bg-zinc-900 border border-blue-500/30 rounded-2xl"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="font-semibold text-lg">
                  {sponsor.sponsorName}
                </h2>
                <p className="text-sm text-gray-400">
                  {sponsor.businessType} • {sponsor.location}
                </p>
                <p className="text-sm text-gray-400">
                  Team: {sponsor.assignedTeam}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-blue-400 font-semibold">
                  ₹{sponsor.amount.toLocaleString("en-IN")}
                </span>

                <Button
                  onClick={() => handleDelete(sponsor?._id)}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
