"use client";

import { useEffect, useState } from "react";
import contractABI from "./abi/predicts.json";
import { useNotification } from "./context/NotificationContext";
import { entertainmentPredictions } from "./predicts/entertainment";
import { newsPredictions } from "./predicts/news";
import { politicsPredictions } from "./predicts/politics";
import { sportsPredictions } from "./predicts/sports";
import { ethers } from "ethers";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const categories = ["Sports", "Politics", "News", "Entertainment"];
// Replace with the actual path to your contract ABI

const contractAddress = "0x70b5e9F41e4004069298132C96605f9f4ae249b9"; // Replace with your deployed contract address

const getContract = () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

type Prediction = {
  id: number;
  title: string;
  category: string;
  yesVotes: number;
  noVotes: number;
};

const predictions = [...sportsPredictions, ...newsPredictions, ...entertainmentPredictions, ...politicsPredictions];

const filters = ["Recent", "Trending", "2025"];

const PredictionSite = () => {
  <style>
    {`
    @keyframes blink {
      0%, 100% { opacity: 1; }
      190% { opacity: 0.5; }
    }
  `}
  </style>;

  const [activeCategory, setActiveCategory] = useState("Sports");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedPrediction, setSelectedPrediction] = useState<(Prediction & { voteType: string }) | null>(null);
  const [voteAmount, setVoteAmount] = useState<number>(0.5);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    try {
      const contractInstance = getContract();
      setContract(contractInstance);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const { addNotification } = useNotification();

  const filteredPredictions = predictions.filter(
    prediction =>
      prediction.category === activeCategory && prediction.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleVoteClick = (prediction: Prediction, voteType: string) => {
    setSelectedPrediction({ ...prediction, voteType });
    setVoteAmount(0.5); // Reset the default amount
  };

  const handleIncrement = (amount: number) => {
    setVoteAmount(prev => parseFloat((prev + amount).toFixed(2)));
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoteAmount(parseFloat(event.target.value));
  };

  async function handleVoteSubmit(predictionId: number, voteType: string, voteAmount: number) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = getContract();

      // Fetch prediction details
      const prediction = await contract.predictions(predictionId);

      if (!prediction) {
        console.log("Prediction not found");
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      // Check if the prediction is still active
      if (currentTime > prediction.endTime) {
        alert("Voting for this prediction has ended.");
        return;
      }

      // Convert vote amount to correct units
      const formattedVoteAmount = ethers.utils.parseEther(voteAmount.toString());

      // Submit the vote
      const tx = await contract.placeBet(predictionId, voteType, {
        value: formattedVoteAmount,
      });

      await tx.wait();

      addNotification({
        id: Date.now(),
        title: `Placed bet on prediction ${predictionId}`,
        countdown: 30,
      });

      console.log("Vote placed successfully", tx);
    } catch (error) {
      console.error("Error while submitting vote:", error);
      alert("Failed to place the vote. Please try again.");
    }
  }

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
                animation: "marquee 50s linear infinite",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {predictions.slice(0, 8).map(prediction => {
                const randomYesAmount = (Math.random() * 0.5).toFixed(3);
                return (
                  <span key={prediction.id} className="text-sm text-gray-300 font-medium px-4">
                    0x9084... puts their money where their mouth is with a yes of {randomYesAmount} MON on{" "}
                    {prediction.category}!
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Category Menu */}
      <div className="flex justify-center space-x-6 py-4 bg-gradient-to-r from-yellow-600 to-pink-500">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`py-2 px-4 rounded-lg font-semibold ${
              activeCategory === category ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2 w-96"
          />
        </div>
        <div className="flex space-x-4">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`py-2 px-4 rounded-lg font-semibold ${
                selectedFilter === filter ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8">
        {filteredPredictions.map(prediction => {
          const totalVotes = prediction.yesVotes + prediction.noVotes;
          const yesPercentage = ((prediction.yesVotes / totalVotes) * 100).toFixed(1);
          const noPercentage = (100 - parseFloat(yesPercentage)).toFixed(1);

          const isActive = selectedPrediction?.id === prediction.id;

          return (
            <div
              key={prediction.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg text-center relative"
              style={{ position: "relative" }}
            >
              {/* Live Indicator */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
                  boxShadow: "0 0 10px #10B981",
                  animation: "blink 1s infinite",
                }}
              ></div>
              <h3 className="font-bold text-lg">{prediction.title}</h3>
              <p className="text-sm text-gray-400 mt-2">Category: {prediction.category}</p>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie
                      data={
                        [
                          { name: "Yes", value: prediction.yesVotes },
                          { name: "No", value: prediction.noVotes },
                        ] as any
                      } // Use 'as any' if you're confident about the data structure
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      fill="#8884d8"
                      label
                    />

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
                    isActive && selectedPrediction?.voteType === "no" ? "bg-red-700" : "bg-red-500 hover:bg-red-600"
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
                    style={{
                      fontSize: "1.5rem", // Increases the font size of the text
                      lineHeight: "1.2",
                      textAlign: "center", // Adjusts line spacing if needed
                    }}
                  />
                  <div className="flex justify-between mb-4">
                    <button
                      onClick={() => handleIncrement(1)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      +1x
                    </button>
                    <button
                      onClick={() => handleIncrement(0.01)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      +1
                    </button>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="100"
                    step="0.1"
                    value={voteAmount}
                    onChange={handleSliderChange}
                    className="w-full"
                  />
                  <button
                    onClick={e => handleVoteSubmit(selectedPrediction.id, selectedPrediction.voteType, voteAmount)}
                    className={`w-full py-2 mt-4 rounded-lg font-bold ${
                      selectedPrediction.voteType === "yes"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    Say {selectedPrediction.voteType.toUpperCase()} to win {(voteAmount * 2).toFixed(2)} MON
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
