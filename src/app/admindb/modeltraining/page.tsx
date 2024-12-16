"use client";

import React, { useState } from "react";

const modelTraining = () => {
  const [configuration, setConfiguration] = useState({
    dataSet: {
      selection: { isActive: false, selected: "Select Dataset" },
      selectionData: ["Datasets", "Example", "Example2"],
    },
    algorithm: {
      selection: { isActive: false, selected: "Select Algorithm" },
      selectionData: ["Algorithm", "Example3", "Example4"],
    },
    manualFeature: {
      selection: { isActive: false, selected: "Select Features" },
      selectionData: ["Multi-selection Data", "Example5", "Example6"],
    },
    numberFolds: 0,
    learningRate: 0,
    numberEpochs: 0,
    regularL1: 0,
    regularL2: 0,
    patienceInput: 0,
    frequency: 0,
    normalization: false,
  });

  const [sliderValue, setSliderValue] = useState(20);

  const handleSliderValue = (e: any) => {
    setSliderValue(e.target.value);
  };
  return (
    <div className="flex flex-col gap-16">
      <div className="grid grid-cols-[300px_1fr] p-2 space-x-4 ">
        <div className="flex-1 p-4 rounded-lg border-black border-[2px] h-fit ">
          <h2 className="text-lg font-bold text-foreground ">
            Upload Training Data
          </h2>
          <div className="flex flex-col items-center mt-4">
            <p className="mt-2 text-muted-foreground">Upload Dataset</p>
            <button className="bg-primary text-primary-foreground p-2 rounded-lg mt-2">
              Upload
            </button>
            <span className="text-sm text-muted-foreground">.csv/excel</span>
          </div>
        </div>

        <div className="flex-1 rounded-lg border-black border-[2px]">
          <h2 className="text-lg font-bold border-b-2 pb-4 border-black">
            Training Configuration:
          </h2>
          <div className="grid grid-cols-[1fr_400px]">
            <div className="flex w-full h-full px-16 gap-12">
              <form className="space-y-4 mt-4 w-full">
                <div>
                  <label className="block text-muted-foreground pb-2">
                    Dataset Selection:
                  </label>
                  <div
                    className={`cursor-pointer relative flex justify-between border-[1px] border-black rounded-tr-lg rounded-tl-lg px-1 py-2  ${!configuration.dataSet.selection.isActive && "rounded-br-lg rounded-bl-lg"}`}
                    onClick={() =>
                      setConfiguration((prev) => ({
                        ...prev,
                        dataSet: {
                          ...prev.dataSet,
                          selection: {
                            ...prev.dataSet.selection,
                            isActive: !prev.dataSet.selection.isActive,
                          },
                        },
                      }))
                    }
                  >
                    <p
                      className={`${configuration.dataSet.selection.selected == "Select Dataset" ? "text-gray-400" : "text-black"}`}
                    >
                      {configuration.dataSet.selection.selected}
                    </p>
                    <div className="">
                      <p className="rotate-90 font-bold">{">"}</p>
                    </div>
                    {configuration.dataSet.selection.isActive && (
                      <div className="flex flex-col gap-1 absolute z-50 -right-[1px] -left-[1px] h-fit -bottom-[82px] border-[1px] border-black rounded-br-lg rounded-bl-lg px-1 bg-gray-200">
                        {configuration.dataSet.selectionData.map((item) => (
                          <p
                            onClick={() =>
                              setConfiguration((prev) => ({
                                ...prev,
                                dataSet: {
                                  ...prev.dataSet,
                                  selection: {
                                    ...prev.dataSet.selection,
                                    selected: item,
                                  },
                                },
                              }))
                            }
                          >
                            {item}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-muted-foreground">
                    Choose Algorithm:
                  </label>
                  <div
                    className={`cursor-pointer relative flex justify-between border-[1px] border-black rounded-tr-lg rounded-tl-lg px-1 py-2  ${!configuration.algorithm.selection.isActive && "rounded-br-lg rounded-bl-lg"}`}
                    onClick={() =>
                      setConfiguration((prev) => ({
                        ...prev,
                        algorithm: {
                          ...prev.algorithm,
                          selection: {
                            ...prev.algorithm.selection,
                            isActive: !prev.algorithm.selection.isActive,
                          },
                        },
                      }))
                    }
                  >
                    <p
                      className={`${configuration.algorithm.selection.selected == "Select Algorithm" ? "text-gray-400" : "text-black"}`}
                    >
                      {configuration.algorithm.selection.selected}
                    </p>
                    <div className="">
                      <p className="rotate-90 font-bold">{">"}</p>
                    </div>
                    {configuration.algorithm.selection.isActive && (
                      <div className="flex flex-col gap-1 absolute z-50 -right-[1px] -left-[1px] h-fit -bottom-[82px] border-[1px] border-black rounded-br-lg rounded-bl-lg px-1 bg-gray-200">
                        {configuration.algorithm.selectionData.map((item) => (
                          <p
                            onClick={() =>
                              setConfiguration((prev) => ({
                                ...prev,
                                algorithm: {
                                  ...prev.algorithm,
                                  selection: {
                                    ...prev.algorithm.selection,
                                    selected: item,
                                  },
                                },
                              }))
                            }
                          >
                            {item}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-muted-foreground">
                    Validation Split:
                  </label>
                  {sliderValue}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliderValue}
                    onChange={handleSliderValue}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-muted-foreground">
                    K-fold Cross-Validation:
                  </label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="kfold"
                      value="enable"
                      className="mr-2"
                    />{" "}
                    Enable
                    <input
                      type="radio"
                      name="kfold"
                      value="disable"
                      className="ml-4 mr-2"
                    />{" "}
                    Disable
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-muted-foreground">
                    Number of folds:
                  </label>
                  <div className="flex items-center w-fit border border-black">
                    <button
                      type="button"
                      className="bg-gray-400 px-4 py-2 text-2xl"
                      onClick={() =>
                        setConfiguration((prev) => ({
                          ...prev,
                          numberFolds:
                            prev.numberFolds > 1 ? prev.numberFolds - 1 : 0,
                        }))
                      }
                    >
                      -
                    </button>
                    <p className=" p-2 w-16 text-center text-sm">
                      {configuration.numberFolds}
                    </p>
                    <button
                      type="button"
                      className="bg-gray-400 px-4 py-2 text-2xl"
                      onClick={() =>
                        setConfiguration((prev) => ({
                          ...prev,
                          numberFolds: prev.numberFolds + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </form>
              <div className="w-full flex flex-col gap-10">
                <div>
                  <h3 className="text-lg font-bold text-foreground mt-6">
                    Hyperparameter Settings:
                  </h3>
                  <form className="space-y-4 mt-4">
                    <div className="flex flex-col gap-2">
                      <label className="block text-muted-foreground">
                        Learning Rate (0.0001 - 1):
                      </label>
                      <div className="flex items-center w-fit border border-black">
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              learningRate:
                                prev.learningRate > 1
                                  ? prev.learningRate - 1
                                  : 0,
                            }))
                          }
                        >
                          -
                        </button>
                        <p className=" p-2 w-16 text-center text-sm">
                          {configuration.learningRate}
                        </p>
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              learningRate: prev.learningRate + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-muted-foreground">
                        Number of Epochs (1-1000):
                      </label>
                      <div className="flex items-center w-fit border border-black">
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              numberEpochs:
                                prev.numberEpochs > 1
                                  ? prev.numberEpochs - 1
                                  : 0,
                            }))
                          }
                        >
                          -
                        </button>
                        <p className=" p-2 w-16 text-center text-sm">
                          {configuration.numberEpochs}
                        </p>
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              numberEpochs: prev.numberEpochs + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-muted-foreground">
                        L1 Regularization (Lasso, 0-10):
                      </label>
                      <div className="flex items-center w-fit border border-black">
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              regularL1:
                                prev.regularL1 > 1 ? prev.regularL1 - 1 : 0,
                            }))
                          }
                        >
                          -
                        </button>
                        <p className=" p-2 w-16 text-center text-sm">
                          {configuration.regularL1}
                        </p>
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              regularL1: prev.regularL1 + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-muted-foreground">
                        L2 Regularization (Ridge, 0-10):
                      </label>
                      <div className="flex items-center w-fit border border-black">
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              regularL2:
                                prev.regularL2 > 1 ? prev.regularL2 - 1 : 0,
                            }))
                          }
                        >
                          -
                        </button>
                        <p className=" p-2 w-16 text-center text-sm">
                          {configuration.regularL2}
                        </p>
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              regularL2: prev.regularL2 + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p>Automatic Feature Selection:</p>
                    <div className="flex gap-2">
                      <input type="checkbox" />
                      <p>Enable</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="">Manual Feature Selection:</p>
                    <div
                      className={`cursor-pointer relative flex justify-between border-[1px] border-black rounded-tr-lg rounded-tl-lg px-1 py-2  ${!configuration.manualFeature.selection.isActive && "rounded-br-lg rounded-bl-lg"}`}
                      onClick={() =>
                        setConfiguration((prev) => ({
                          ...prev,
                          manualFeature: {
                            ...prev.manualFeature,
                            selection: {
                              ...prev.manualFeature.selection,
                              isActive: !prev.manualFeature.selection.isActive,
                            },
                          },
                        }))
                      }
                    >
                      <p
                        className={`${configuration.manualFeature.selection.selected == "Select Features" ? "text-gray-400" : "text-black"}`}
                      >
                        {configuration.manualFeature.selection.selected}
                      </p>
                      <div className="">
                        <p className="rotate-90 font-bold">{">"}</p>
                      </div>
                      {configuration.manualFeature.selection.isActive && (
                        <div className="flex flex-col gap-1 absolute z-50 -right-[1px] -left-[1px] h-fit -bottom-[82px] border-[1px] border-black rounded-br-lg rounded-bl-lg px-1 bg-gray-200">
                          {configuration.manualFeature.selectionData.map(
                            (item) => (
                              <p
                                onClick={() =>
                                  setConfiguration((prev) => ({
                                    ...prev,
                                    manualFeature: {
                                      ...prev.manualFeature,
                                      selection: {
                                        ...prev.manualFeature.selection,
                                        selected: item,
                                      },
                                    },
                                  }))
                                }
                              >
                                {item}
                              </p>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-2 border-black px-5">
              <h3 className="text-lg font-bold text-foreground mt-6">
                Advanced Options:
              </h3>
              <div className="flex flex-col py-2">
                <form className="space-y-4 mt-4">
                  <div>
                    <label className="block text-muted-foreground">
                      Batch Size (0-1000):
                    </label>
                    <input
                      type="number"
                      className="border border-border rounded-lg p-2 w-full"
                    />
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />{" "}
                    <span className="text-muted-foreground">
                      Enable early stopping
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-muted-foreground">
                      Patience Input:
                    </label>
                    <div className="flex w-fit items-center border-[1px] border-black">
                      <button
                        type="button"
                        className="bg-gray-400 px-4 py-2 text-2xl"
                        onClick={() =>
                          setConfiguration((prev) => ({
                            ...prev,
                            patienceInput:
                              prev.patienceInput > 0
                                ? prev.patienceInput - 1
                                : 0,
                          }))
                        }
                      >
                        -
                      </button>
                      <p className=" p-2 w-16 text-center text-sm">
                        {configuration.patienceInput}
                      </p>
                      <button
                        type="button"
                        className="bg-gray-400 px-4 py-2 text-2xl"
                        onClick={() =>
                          setConfiguration((prev) => ({
                            ...prev,
                            patienceInput: prev.patienceInput + 1,
                          }))
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </form>
                <div>
                  <h3 className="text-lg font-bold text-foreground mt-6">
                    Data Pre-processing:
                  </h3>
                  <form className="space-y-4 mt-4">
                    <div className="flex flex-col gap-2">
                      <label>Normalization:</label>
                      <div className="flex gap-2 items-center">
                        <p>{configuration.normalization ? "On" : "Off"}</p>
                        <div
                          className={`w-16 h-8 rounded-full flex border-[1px] border-black  ${configuration.normalization ? "justify-end bg-gray-400" : "justify-start "}`}
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              normalization: !prev.normalization,
                            }))
                          }
                        >
                          <div
                            className={`h-full w-8 rounded-full border-[1px] border-black ${!configuration.normalization ? "bg-gray-400" : "bg-white"}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-muted-foreground">
                        Imputation:
                      </label>
                      <select className="mt-1 block w-full border border-border rounded-lg p-2">
                        <option>Imputation Method</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="">Model Save Options:</label>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />{" "}
                        <span className="text-muted-foreground">
                          Save Model on Completion
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-muted-foreground">
                        Save Frequency (epochs, 0-100):
                      </label>
                      <div className="flex items-center border border-black w-fit">
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              frequency:
                                prev.frequency > 1 ? prev.frequency - 1 : 0,
                            }))
                          }
                        >
                          -
                        </button>
                        <p className=" p-2 w-16 text-center text-sm">
                          {configuration.frequency}
                        </p>
                        <button
                          type="button"
                          className="bg-gray-400 px-4 py-2 text-2xl"
                          onClick={() =>
                            setConfiguration((prev) => ({
                              ...prev,
                              frequency: prev.frequency + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="flex mt-6 w-full justify-end text-xs gap-2">
                  <button className="border-[2px] border-black px-4 h-fit py-1 rounded-lg">
                    Start Training
                  </button>
                  <button className="border-[2px] border-black px-4 h-fit py-1 rounded-lg">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_400px] border-[2px] rounded-lg border-black mx-2">
        <div className="border-r-[2px] border-black">
          <div className="border-b-2 border-black h-[70px] text-xl px-4 flex items-center">
            Graphs
          </div>
          <div>
            <p className="text-xl px-4 pt-4">Loss, Accuracy etc...</p>
            <div className="h-[600px]">
              <div className="grid grid-rows-2 grid-cols-2 h-full">
                <div className="grow ">
                  <div className="h-full flex justify-center items-center">
                    A
                  </div>
                  <div className="h-full flex justify-center items-center">
                    B
                  </div>
                </div>
                <div className="grow">
                  <div className="h-full flex justify-center items-center">
                    A
                  </div>
                  <div className="h-full flex justify-center items-center">
                    B
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="border-b-2 border-black h-[70px] text-xl px-4 flex items-center">
            Summary
          </div>
          <div className="grow">
            <ul className="flex flex-col text-md">
              <li className="border-b-2 border-black h-[70px] px-4 flex items-center">
                Status
              </li>
              <li className="border-b-2 border-black h-[70px] px-4 flex items-center">
                Iteration
              </li>
              <li className="border-b-2 border-black h-[70px] px-4 flex items-center">
                Algorithm
              </li>
              <li className="border-b-2 border-black h-[70px] px-4 flex items-center">
                Created
              </li>
              <li className="border-b-2 border-black h-[70px] px-4 flex items-center">
                Duration
              </li>
              <li className="border-b-2 border-black h-[70px] px-4 flex items-center">
                Model Version
              </li>
            </ul>
            <div>
              <p className="h-[70px] px-4 flex items-center">Download Report</p>
              <div className="h-[80px] border-[2px] border-black mx-6 rounded-xl flex items-center justify-center">
                Download
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-[2px] grid grid-rows-[70px_300px] rounded-lg border-black px-2 mx-2">
        <div className="text-xl font-semibold flex items-center px-2">
          Model Insight
        </div>
        <div className="text-md px-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
        </div>
      </div>
      <div className="grid grid-cols-[1fr_700px] h-[600px] gap-5 mx-2 ">
        <div className="border-2 border-black rounded-lg h-full overflow-hidden">
          <div className="border-b-2 border-black h-[70px] flex items-center px-4">
            Training History
          </div>
          <div className="flex  w-full h-full">
            <div className="grid-rows-[70px_1fr] grid grow">
              <div className="border-b-2 border-black flex items-center justify-center px-2">
                Timestamp
              </div>
              <div>A</div>
            </div>
            <div className="grid-rows-[70px_1fr] grow grid border-l-2 border-black">
              <div className="border-b-2 border-black flex items-center justify-center  px-2">
                Parameters
              </div>
              <div>B</div>
            </div>
          </div>
        </div>
        <div className="border-2 border-black rounded-lg px-4 grid grid-rows-[70px_1fr]">
          <div className="flex items-center">Performance Metrics</div>
          <div className="flex items-center justify-center">asd</div>
        </div>
      </div>
    </div>
  );
};

export default modelTraining;
