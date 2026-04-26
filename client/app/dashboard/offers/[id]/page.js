'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../../lib/api';

export default function OfferViewPage() {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);

    useEffect(() => {
        if (id) fetchOffer();
    }, [id]);

    const fetchOffer = async () => {
        try {
            const { data } = await api.get(`/offers/${id}`);
            setOffer(data);
        } catch (err) {
            console.error('Error fetching offer:', err);
        }
    };

    if (!offer) {
        return <p className="p-6">Loading...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{offer.candidateName}</h1>
            <p>{offer.candidateEmail}</p>
            <p>{offer.jobTitle}</p>
            <p>${offer.salary}</p>
            <p>Status: {offer.status}</p>
        </div>
    );
}
