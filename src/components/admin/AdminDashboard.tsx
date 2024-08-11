"use client";

import {
  faRocket,
  faUsers,
  faChartLine,
  faCreditCard,
  faChartBar,
  faCog,
  faUserPlus,
  faFileInvoiceDollar,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Section from "../shared/Section";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

interface DashboardData {
  totalCustomers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  mrr: number;
  churnRate: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [amount, setAmount] = useState<number | "">("");
  const [dueDate, setDueDate] = useState("");

  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  // Fetch stripe dashboard data
  const {
    data: dashboardData,
    error: dashboardError,
    mutate: mutateDashboard,
  } = useSWR<DashboardData>("/api/stripe/admin", fetcher);

  const {
    data: customers,
    error: customersError,
    mutate: mutateCustomers,
  } = useSWR<{ customers: Array<{ id: string; email: string }> }>(
    "/api/stripe/customers",
    fetcher
  );

  if (dashboardError) {
    toast.error("Failed to fetch dashboard data");
  }

  if (customersError) {
    toast.error("Failed to fetch customers");
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
  };

  const handleGenerateInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

  const generateInvoice = async () => {
    if (!selectedCustomerId) {
      toast.error("Please select a customer");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }

    setIsGeneratingInvoice(true);
    try {
      const response = await fetch("/api/stripe/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          amount: parseFloat(amount.toString()),
          dueDate,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate invoice");
      }
      const { invoiceUrl } = await response.json();
      window.open(invoiceUrl, "_blank");
      setIsInvoiceModalOpen(false);
      setAmount("");
      setDueDate("");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice. Please try again.");
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const handleAddCustomer = () => {
    setIsAddCustomerModalOpen(true);
  };

  const addCustomer = async () => {
    if (!newCustomerEmail) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsAddingCustomer(true);
    try {
      const response = await fetch("/api/stripe/addCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newCustomerEmail }),
      });
      if (!response.ok) {
        throw new Error("Failed to add customer");
      }
      const { customerId } = await response.json();
      toast.success("Customer added successfully");
      setIsAddCustomerModalOpen(false);
      setNewCustomerEmail("");
      mutateCustomers();
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Failed to add customer. Please try again.");
    } finally {
      setIsAddingCustomer(false);
    }
  };

  return (
    <Section
      title="FireSaaS Dashboard"
      subtitle="Welcome to your all-in-one SaaS management platform!"
      icon={faRocket}
      mockup={true}
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FontAwesomeIcon icon={faUsers} size="2x" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">
              {formatNumber(dashboardData?.totalCustomers || 0)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <FontAwesomeIcon icon={faChartLine} size="2x" />
            </div>
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value text-secondary">
              ${formatNumber(dashboardData?.totalRevenue || 0)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <FontAwesomeIcon icon={faCreditCard} size="2x" />
            </div>
            <div className="stat-title">Active Subscriptions</div>
            <div className="stat-value text-accent">
              {formatNumber(dashboardData?.activeSubscriptions || 0)}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="card bg-base-100 shadow-xl flex-1">
            <div className="card-body">
              <h2 className="card-title">
                <FontAwesomeIcon icon={faChartBar} className="text-primary" />
                Key Metrics
              </h2>
              <ul className="list-none space-y-2">
                <li>
                  <span className="font-semibold">MRR:</span> $
                  {formatNumber(dashboardData?.mrr || 0)}
                </li>
                <li>
                  <span className="font-semibold">Churn Rate:</span>{" "}
                  {formatNumber(dashboardData?.churnRate || 0)}%
                </li>
                <li>
                  <span className="font-semibold">ARPU:</span> $
                  {(
                    (dashboardData?.mrr || 0) /
                    (dashboardData?.activeSubscriptions || 1)
                  ).toFixed(2)}
                </li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl flex-1">
            <div className="card-body">
              <h2 className="card-title">
                <FontAwesomeIcon icon={faCog} className="text-secondary" />
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleAddCustomer}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  Add Customer
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={handleGenerateInvoice}
                >
                  <FontAwesomeIcon
                    icon={faFileInvoiceDollar}
                    className="mr-2"
                  />
                  Generate Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <dialog
        id="invoice_modal"
        className={`modal ${isInvoiceModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Generate Invoice</h3>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Select Customer</span>
            </label>
            <select
              value={selectedCustomerId || ""}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select a customer</option>
              {customers?.customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.email}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Invoice Amount (USD)</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Enter amount"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Due Date</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div className="modal-action mt-6">
            <button
              className="btn btn-primary"
              onClick={generateInvoice}
              disabled={isGeneratingInvoice}
            >
              {isGeneratingInvoice ? "Generating..." : "Generate Invoice"}
            </button>
            <button
              className="btn"
              onClick={() => setIsInvoiceModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <dialog
        id="add_customer_modal"
        className={`modal ${isAddCustomerModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add New Customer</h3>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Customer Email</span>
            </label>
            <input
              type="email"
              value={newCustomerEmail}
              onChange={(e) => setNewCustomerEmail(e.target.value)}
              placeholder="Enter customer email"
              className="input input-bordered w-full"
            />
          </div>
          <div className="modal-action mt-6">
            <button
              className="btn btn-primary"
              onClick={addCustomer}
              disabled={isAddingCustomer}
            >
              {isAddingCustomer ? "Adding..." : "Add Customer"}
            </button>
            <button
              className="btn"
              onClick={() => setIsAddCustomerModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </Section>
  );
}
