import React from 'react';
import { MembershipType } from '../../../redux/slice/membershipSlice';
import { CustomerTypes } from '../../../redux/slice/customerSlice';
import jsPDF from 'jspdf';
import { useLocation } from 'react-router-dom';

const MembershipCard: React.FC = () => {
    const location = useLocation();
    const { customer, membership }: { customer: CustomerTypes; membership: MembershipType } = location.state;

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Adding membership card title
        doc.text("Membership Card", 10, 10);
        doc.text(`Customer Name: ${customer.name}`, 10, 20);
        doc.text(`Mobile: ${customer.mobile}`, 10, 30);
        doc.text(`Membership Type: ${membership.name}`, 10, 40);

        // Check if the QR code is valid
        if (membership.qrCode && membership.qrCode.startsWith('data:image/png;base64,')) {
            doc.addImage(membership.qrCode, "PNG", 10, 50, 50, 50);
        } else {
            console.error("Invalid QR code format");
            doc.text("QR Code is not available", 10, 50); // Handle the case where QR code is invalid
        }

        // Save the PDF
        doc.save("membership-card.pdf");
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '300px' }}>
            <h3>Membership Card for {customer.name}</h3>
            <button onClick={downloadPDF} style={{ marginBottom: '20px' }}>Download PDF</button>
            <div style={{ border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
                <h4>Customer Details:</h4>
                <p><strong>Name:</strong> {customer.name}</p>
                <p><strong>Mobile:</strong> {customer.mobile}</p>
                
                <h4>Membership Details:</h4>
                <p><strong>Type:</strong> {membership.name}</p>
                <p><strong>Description:</strong> {membership.description}</p>
                
                {membership.qrCode && membership.qrCode.startsWith('data:image/png;base64,') && (
                    <img src={membership.qrCode} alt="QR Code" style={{ marginTop: '10px', width: '50px', height: '50px' }} />
                )}
            </div>
        </div>
    );
};

export default MembershipCard;
