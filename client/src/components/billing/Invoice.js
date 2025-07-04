import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Invoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`/api/billing/${id}/invoice`);
        setInvoice(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch invoice');
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return <div>Loading invoice...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!invoice) return <div>No invoice data found</div>;

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="invoice">
      <div className="invoice-header">
        <h2>Hospital Management System</h2>
        <h3>Invoice #{invoice.invoiceNumber}</h3>
        <div className="invoice-meta">
          <p>Date Issued: {new Date(invoice.dateIssued).toLocaleDateString()}</p>
          {invoice.dueDate && (
            <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
          )}
          <p>Status: {invoice.paymentStatus}</p>
        </div>
      </div>

      <div className="invoice-patient">
        <h4>Patient Information</h4>
        <p>
          {invoice.patient.firstName} {invoice.patient.lastName}
        </p>
        <p>{invoice.patient.address}</p>
        <p>{invoice.patient.phone}</p>
        <p>{invoice.patient.email}</p>
      </div>

      {invoice.appointment && (
        <div className="invoice-appointment">
          <h4>Appointment Details</h4>
          <p>
            Date: {new Date(invoice.appointment.date).toLocaleDateString()} at{' '}
            {invoice.appointment.time}
          </p>
          <p>Reason: {invoice.appointment.reason}</p>
        </div>
      )}

      <div className="invoice-services">
        <h4>Services</h4>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.services.map((service, index) => (
              <tr key={index}>
                <td>{service.description}</td>
                <td>${service.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>${invoice.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Paid</td>
              <td>${invoice.paidAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Balance Due</td>
              <td>${invoice.balanceDue.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="invoice-actions">
        <button onClick={printInvoice}>Print Invoice</button>
      </div>
    </div>
  );
};

export default Invoice;