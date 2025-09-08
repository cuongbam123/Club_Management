import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "../../components/EventCard";
import { allEvents as initialEvents } from "../../eventsData";

export default function EventClub() {
    const location = useLocation();
    const club = location.state?.club;

    const clubEventsInit = club ? initialEvents.filter((e) => e.club === club.name) : [];
    const [clubEvents, setClubEvents] = useState(clubEventsInit);

    useEffect(() => {
        if (club) {
            setClubEvents(initialEvents.filter((e) => e.club === club.name));
        }
    }, [club]);

    if (!club) {
        return <p className="text-center mt-10">CLB không tồn tại.</p>;
    }

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
            className="
                relative min-h-screen
                bg-white
                dark:bg-[url('https://png.pngtree.com/thumb_back/fw800/background/20190221/ourmid/pngtree-mid-autumn-festival-mid-autumn-festival-mid-autumn-material-full-of-image_11694.jpg')]
                dark:bg-cover dark:bg-center dark:bg-fixed
                transition-colors duration-500
            "
        >
            {/* Nội dung */}
            <div className="relative z-10">
                <div
                    className="p-6 text-center shadow-lg mb-12 
                               bg-gray-100 dark:bg-gray-800 rounded-xl"
                    style={{
                        width: "1200px",
                        maxWidth: "1200px",
                        margin: "0 auto 40px auto",
                    }}
                >
                    <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                        {club.name}
                    </h1>

                    <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="mb-6 shadow-lg rounded-lg"
                        style={{ width: "100%", height: "auto", maxHeight: "500px" }}
                    />

                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                        <strong>Chủ nhiệm:</strong> {club.president}
                    </p>
                    <p className="text-gray-700 dark:text-gray-200 mb-6">
                        {club.description}
                    </p>

                    {localStorage.getItem("hasJoinedClub") === "true" && (
                        <p className="text-white bg-gradient-to-r from-purple-500 to-indigo-600 inline-block px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                            Bạn đã tham gia
                        </p>
                    )}
                </div>

                <div
                    className="p-6 max-w-5xl mx-auto min-h-screen 
                               bg-white dark:bg-gray-700 rounded-xl shadow-2xl"
                >
                    <h2
                        className="text-4xl font-extrabold mb-12 text-center
                                   bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
                                   bg-clip-text text-transparent drop-shadow-md italic tracking-widest"
                    >
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
                        <p className="text-center text-gray-500 dark:text-gray-300 text-lg">
                            Chưa có sự kiện nào cho CLB này.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
