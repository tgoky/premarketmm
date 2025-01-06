"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BoltIcon,
  ChartPieIcon,
  FireIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { sportsPredictions } from "./predicts/sports";
import { newsPredictions } from "./predicts/news";
import { entertainmentPredictions } from "./predicts/entertainment";
import { politicsPredictions } from "./predicts/politics";


const categories = ["Sports", "Politics", "News", "Entertainment"];

type Prediction = {
  id: number;
  title: string;
  category: string;
  yesVotes: number;
  noVotes: number;
};
  
  
const predictions = [
  ...sportsPredictions,
  ...newsPredictions,
  ...entertainmentPredictions,
  ...politicsPredictions,
];

const filters = ["Recent", "Trending", "2025"];



const PredictionSite = () => {
  const [activeCategory, setActiveCategory] = useState("Sports");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedPrediction, setSelectedPrediction] = useState<
  (Prediction & { voteType: string }) | null
>(null);
const [voteAmount, setVoteAmount] = useState<number>(0.1);

  const filteredPredictions = predictions.filter(
    (prediction) =>
      prediction.category === activeCategory &&
      prediction.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVoteClick = (prediction: Prediction, voteType: string) => {
    setSelectedPrediction({ ...prediction, voteType });
    setVoteAmount(0.1); // Reset the default amount
  };

  const handleIncrement = (amount: number) => {
    setVoteAmount((prev) => parseFloat((prev + amount).toFixed(2)));
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoteAmount(parseFloat(event.target.value));
  };

  const handleVoteSubmit = () => {
    if (!selectedPrediction) return;

    const potentialWin = (voteAmount * 2).toFixed(2);
    alert(
      `You voted ${selectedPrediction.voteType.toUpperCase()} with ${voteAmount} MON. Potential win: ${potentialWin} MON!`
    );
    setSelectedPrediction(null); // Reset after submission
  };

  return (
   <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-red from-yellow-600 to-pink-500">
        <h1 className="text-4xl font-bold" style={{ fontFamily: "'Nosifer', sans-serif" }}>
          monad muffled birdy market
        </h1>
        <p className="text-3xl mt-2" style={{ fontFamily: "'Rubik Scribble', sans-serif" }}>
          be a muffled bird on the monad market!
        </p>
      </div>

      {/* Marquee */}
      <div className="w-full bg-gray-800 py-2">
        <div className="overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee space-x-8">
          <div
            className="inline-block space-x-8"
            style={{
              animation: 'marquee 50s linear infinite',
              whiteSpace: 'nowrap',
                   display: 'inline-block',
            }}
          >
            {predictions.slice(0, 8).map((prediction) => {
              const randomYesAmount = (Math.random() * 0.1).toFixed(3);
              return (
                <span
                  key={prediction.id}
                  className="text-sm text-gray-300 font-medium px-4"
                >
                  0x9084... puts their money where their mouth is with a yes of{" "}
                  {randomYesAmount} MON on {prediction.category}!
                </span>
              );
            })}
          </div>
          </div>
        </div>
      </div>

      {/* Category Menu */}
      <div className="flex justify-center space-x-6 py-4 bg-gradient-to-r from-yellow-600 to-pink-500">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`py-2 px-4 rounded-lg font-semibold ${
              activeCategory === category
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar & Filters */}
      <div className="flex justify-between items-center px-8 py-4 bg-gray-800">
        <div className="flex items-center space-x-2">
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search predictions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2 w-96"
          />
        </div>
        <div className="flex space-x-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`py-2 px-4 rounded-lg font-semibold ${
                selectedFilter === filter
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8">
  {filteredPredictions.map((prediction) => {
    const totalVotes = prediction.yesVotes + prediction.noVotes;
    const yesPercentage = ((prediction.yesVotes / totalVotes) * 100).toFixed(1);
    const noPercentage = (100 - parseFloat(yesPercentage)).toFixed(1);

    const isActive = selectedPrediction?.id === prediction.id;

    return (
      <div
        key={prediction.id}
        className="bg-gray-800 rounded-lg p-6 shadow-lg text-center"
      >
        <h3 className="font-bold text-lg">{prediction.title}</h3>
        <p className="text-sm text-gray-400 mt-2">Category: {prediction.category}</p>
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={[
                  { name: "Yes", value: prediction.yesVotes },
                  { name: "No", value: prediction.noVotes },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="Yes" fill="#10B981" />
                <Cell key="No" fill="#EF4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            className={`${
              isActive && selectedPrediction?.voteType === "yes"
                ? "bg-green-700"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-bold py-2 px-4 rounded-lg`}
            onClick={() => handleVoteClick(prediction, "yes")}
          >
            Yes
          </button>
          <button
            className={`${
              isActive && selectedPrediction?.voteType === "no"
                ? "bg-red-700"
                : "bg-red-500 hover:bg-red-600"
            } text-white font-bold py-2 px-4 rounded-lg`}
            onClick={() => handleVoteClick(prediction, "no")}
          >
            No
          </button>
        </div>
        <p className="mt-4 text-sm">
          Yes: {yesPercentage}% | No: {noPercentage}%
        </p>

        {/* Voting Interface */}
        {isActive && (
          <div className="mt-4 bg-gray-700 p-4 rounded-lg">
            <textarea
              readOnly
              value={voteAmount.toFixed(2)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mb-4 text-right"
            />
            <div className="flex justify-between mb-4">
              <button
                onClick={() => handleIncrement(1)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                +1
              </button>
              <button
                onClick={() => handleIncrement(10)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                +10
              </button>
            </div>
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={voteAmount}
              onChange={handleSliderChange}
              className="w-full"
            />
            <button
              onClick={handleVoteSubmit}
              className={`w-full py-2 mt-4 rounded-lg font-bold ${
                selectedPrediction.voteType === "yes"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Buy {selectedPrediction.voteType.toUpperCase()} to win{" "}
              {(voteAmount * 2).toFixed(2)} MON
            </button>
          </div>
        )}
      </div>
    );
  })}
</div>

    </div>
  );
};

export default PredictionSite;
