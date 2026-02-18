"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teams } from "@/teams";

interface Sponsor {
  _id: string;
  name: string;
  businessType: string;
  location: string;
  assignedTeam: string;
  pakage: string;
  amount: string;
}

export default function Dashboard() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    businessType: "",
    location: "",
    assignedTeam: "",
    pakage: "",
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

      const response = await axios.delete(`/api/delete/${id}`);
      // console.log(response);

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

    // console.log(formData);

    try {
      const newSponsor = {
        name: formData.name,
        businessType: formData.businessType,
        location: formData.location,
        assignedTeam: formData.assignedTeam,
        pakage: formData.pakage,
        amount: formData.amount,
      };

      if (!formData.assignedTeam) {
        alert("Please select an assigned team");
        return;
      }

      if (!formData.pakage) {
        alert("Please select a package");
        return;
      }

      const response = await axios.post("/api/add-sponsor", newSponsor);
      // console.log(response);

      await fetchSponsors();

      setFormData({
        name: "",
        businessType: "",
        location: "",
        assignedTeam: "",
        pakage: "",
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
      const numericValue = Number(sponsor.amount);
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
          <p className="text-xl sm:text-xl font-semibold text-blue-400">
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
                  name="name"
                  placeholder="Sponsor Name"
                  value={formData.name}
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

                <Select
                  value={formData.assignedTeam}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assignedTeam: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Select Assigned Team"
                      className="truncate"
                    />
                  </SelectTrigger>

                  <SelectContent className="max-h-60 overflow-y-auto bg-zinc-900 text-white">
                    <SelectGroup>
                      {teams.map((team) => (
                        <SelectItem
                          key={team}
                          value={team}
                          className="whitespace-normal leading-snug"
                        >
                          {team}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* Packages */}
                <Select
                  value={formData.pakage}
                  onValueChange={(value) =>
                    setFormData({ ...formData, pakage: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Select Package"
                      className="truncate"
                    />
                  </SelectTrigger>

                  <SelectContent className="max-h-60 overflow-y-auto bg-zinc-900 text-white">
                    <SelectGroup>
                      <SelectItem value="Title Sponsor">
                        Title Sponsor
                      </SelectItem>
                      <SelectItem value="Gold Sponsor">Gold Sponsor</SelectItem>
                      <SelectItem value="Silver Sponsor">
                        Silver Sponsor
                      </SelectItem>
                      <SelectItem value="Support Sponsor">
                        Support Sponsor
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Input
                  name="amount"
                  placeholder="Amount (₹)"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Sponsor"
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
      {/* Sponsor List */}
      <div className="grid gap-4">
        {sponsors.map((sponsor) => (
          <Card
            key={sponsor?._id}
            className="bg-zinc-900 border border-blue-500/30 rounded-2xl"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="font-semibold text-white text-lg">
                  {sponsor.name.toUpperCase()}
                </h2>
                <p className="text-sm text-gray-400">
                  {sponsor.businessType} • {sponsor.location}
                </p>
                <p className="text-sm text-gray-400">
                  Team: {sponsor.assignedTeam}
                </p>
                <span className="px-3 py-1 text-white rounded-full text-xs bg-blue-500/20 border border-blue-500/40">
                  {sponsor.pakage}
                </span>
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
