"use client";

import React from "react";
import Link from "next/link";

const BirdyTask = () => {
  const image = { src: "/hmm.PNG", alt: "Birdy Tasks" };

  const tasks = [
    {
      title: "Follow us on Twitter",
      description: "Stay updated with our latest announcements and updates.",
      link: "https://x.com/yourhandle",
      buttonText: "Follow on Twitter",
    },
    {
      title: "Join our Telegram",
      description: "Be part of the discussion and get real-time updates.",
      link: "https://t.me/yourtelegram",
      buttonText: "Join Telegram",
    },
    {
      title: "Join our Discord",
      description: "Engage with the community and find helpful resources.",
      link: "https://discord.gg/yourdiscord",
      buttonText: "Join Discord",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-white mb-8">Birdy Tasks</h1>

      {/* Single Rectangle Card */}
      <div className="bg-gray-800 shadow-lg hover:shadow-xl transition rounded-lg overflow-hidden w-full max-w-5xl">
        {/* Single Image */}
        <img src={image.src} alt={image.alt} className="object-cover w-full h-64" />

        {/* Tasks Section */}
        <div className="p-6">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-700 pb-4 last:border-b-0"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg text-white font-semibold">{task.title}</h3>
                <p className="text-gray-400">{task.description}</p>
              </div>
              <Link href={task.link} target="_blank" rel="noopener noreferrer" passHref>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                  {task.buttonText}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirdyTask;
