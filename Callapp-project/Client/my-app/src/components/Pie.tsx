import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import create from "zustand";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  {
    name: "New York",
    value: 0,
    color: "#0088FE",
  },
  {
    name: "Chicago",
    value: 0,
    color: "#00C49F",
  },
  {
    name: "San Diego",
    value: 0,
    color: "#FFBB28",
  },
  {
    name: "Los Angeles",
    value: 0,
    color: "#FFBB48",
  },
];

interface cityDataTypes {
  name: string;
  value: number;
  color: string;
}

interface CityDataState {
  cityData: cityDataTypes[];
  setCityData: (data: cityDataTypes[]) => void;
}

const useCityData = create<CityDataState>((set) => ({
  cityData: data,
  setCityData: (data: cityDataTypes[]) => set({ cityData: data }),
}));

interface UsersInfo {
  age: string;
  id: number;
  name: string;
  email: string;
  gender: string;
  address: { street: string; city: string };
  phone: string;
}

interface UsersArrayState {
  info: UsersInfo[];
  setInfo: (info: UsersInfo[]) => void;
}

const userInfoState = create<UsersArrayState>((set) => ({
  info: [],
  setInfo: (info: UsersInfo[]) => set({ info }),
}));
interface Props {
  dataLength: number;
  pieChart: boolean;
  setPieChart: (pieChart: boolean) => void;
}

const Chart = (props: Props) => {
  const { cityData, setCityData } = useCityData();

  const { info, setInfo } = userInfoState();

  useEffect(() => {
    axios
      .get("/api")
      .then((res) => {
        setInfo(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleClick = () => {
    props.setPieChart(!props.pieChart);
  };
  useEffect(() => {
    axios
      .get("/api")
      .then((res) => {
        setInfo(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [props.dataLength]);

  useEffect(() => {
    if (info.length) {
      interface CityCount {
        [cityName: string]: number;
      }

      let cityCount: CityCount = {};

      for (let i = 0; i < info.length; i++) {
        let city = info[i].address.city;

        if (cityCount[city]) {
          cityCount[city]++;
        } else {
          cityCount[city] = 1;
        }
      }

      let updatedCityData = [...cityData];

      for (let i = 0; i < updatedCityData.length; i++) {
        let city = updatedCityData[i].name;

        if (cityCount[city]) {
          updatedCityData[i].value = cityCount[city];
        }
      }

      setCityData(updatedCityData);
      console.log(cityCount, "city");
    }
  }, [info]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row-reverse",
        padding: "20px",
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={cityData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {cityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <Button
        style={{ backgroundColor: "white", color: "grey" }}
        onClick={handleClick}
      >
        Close{" "}
      </Button>
    </div>
  );
};

export default Chart;
