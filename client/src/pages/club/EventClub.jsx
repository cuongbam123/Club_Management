// src/pages/EventClub.jsx
import React, { useState, useEffect } from "react";
import EventCard from "../../components/EventCard";
import { allEvents as initialEvents } from "../../eventsData";

export default function EventClub({ club }) {
    const clubEventsInit = initialEvents.filter((e) => e.club === club.name);
    const [clubEvents, setClubEvents] = useState(clubEventsInit);

    useEffect(() => {
        setClubEvents(initialEvents.filter((e) => e.club === club.name));
    }, [club]);

    const handleRegister = (id) => {
        setClubEvents((prev) =>
            prev.map((e) => (e.id === id ? { ...e, registered: true } : e))
        );
    };

    const handleUnregister = (id) => {
        setClubEvents((prev) =>
            prev.map((e) => (e.id === id ? { ...e, registered: false } : e))
        );
    };

    return (
        <div
            className="p-6 max-w-5xl mx-auto min-h-screen"
            style={{ background: "linear-gradient(to bottom, #edf6fd, #f0fbff)" }}
        >
            <h2 className="text-4xl font-extrabold mb-12 text-center
    bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
    bg-clip-text text-transparent drop-shadow-md italic tracking-widest">
                {`Sự kiện của ${club.name}`}
            </h2>



            {clubEvents.length > 0 ? (
                <div className="grid gap-8 grid-cols-1">
                    {clubEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onRegister={() => handleRegister(event.id)}
                            onUnregister={() => handleUnregister(event.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">
                    Chưa có sự kiện nào cho CLB này.
                </p>
            )}
        </div>
    );
}
