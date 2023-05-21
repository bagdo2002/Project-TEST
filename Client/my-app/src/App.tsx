import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Chart from "./components/Pie";
import { Form, Input, Select } from "antd";
import { Table, Button, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { FC, Dispatch, SetStateAction } from "react";
import validator from "validator";
import create from "zustand";

const { Option } = Select;

interface Users {
  id: number;
  name: string;
  email: string;
  gender: string;
  address: { street: string; city: string };
  phone: string;
}

interface UsersState {
  users: Users[];
  setUsers: (users: Users[]) => void;
}

interface UserDetaield {
  name: string;
  email: string;
  gender: string;
  address: { street: string; city: string };
  phone: string;
}
interface User {
  user: UserDetaield;
  setUser: (user: UserDetaield) => void;
}

interface Json {
  id: number;
  name: string;
  email: string;
  gender: string;

  address: { street: string; city: string };
  phone: string;
}
const useUsersStore = create<UsersState>((set) => ({
  users: [],
  setUsers: (users: Users[]) => set({ users }),
}));

interface booleanStaff {
  pieChart: boolean;
  open: boolean;
  update: boolean;
  setPieChart: (pieChart: boolean) => void;
  setOpen: (open: boolean) => void;
  setUpdate: (update: boolean) => void;
}
const booleanStates = create<booleanStaff>((set) => ({
  pieChart: false,
  open: false,
  update: false,
  setPieChart: (pieChart) => set({ pieChart }),
  setOpen: (open) => set({ open }),
  setUpdate: (update) => set({ update }),
}));

interface idd {
  id: number | null;
  setId: (id: number) => void;
}

const idState = create<idd>((set) => ({
  id: null,
  setId: (id) => set({ id }),
}));

const userState = create<User>((set) => ({
  user: {
    name: "",
    email: "",
    gender: "",
    address: { street: "", city: "" },
    phone: "",
  },

  setUser: (user) => set({ user }),
}));

const Users = () => {
  const { users, setUsers } = useUsersStore();
  const { pieChart, open, update, setPieChart, setOpen, setUpdate } =
    booleanStates();
  const { user, setUser } = userState();

  const { id, setId } = idState();

  const [form] = Form.useForm();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: { city: string; street: string }) => (
        <span>
          {address.street}, {address.city}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: string, record: Json) => (
        <Space size="middle">
          <Button onClick={() => handleDeleteUser(record)}>Delete</Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    axios
      .get("/api")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDeleteUser = (record: { id: number }) => {
    axios
      .delete(`/api/${record?.id}`)
      .then(() => {
        let filtered = users.filter((el) => el.id !== record.id);
        setUsers(filtered);
      })
      .catch((error) => console.log(error));
  };

  const handleOpen = () => {
    setOpen(!open);

    setUser({
      name: "",
      email: "",
      gender: "",
      address: { street: "", city: "" },
      phone: "",
    });
  };

  const handleAddUser = () => {
    if (update) {
      if (!user.name.trim()) {
        alert("Name is required");
      } else if (!validator.isEmail(user.email)) {
        alert("Email is invalid");
      } else if (!["male", "female"].includes(user.gender.toLowerCase())) {
        alert("Gender should be either male or female");
      } else if (!user.address.street.trim() || !user.address.city.trim()) {
        alert("Street and City are required");
      } else if (!validator.isMobilePhone(user.phone)) {
        alert("Phone number is invalid");
      } else {
        let updatedUser = {
          ...user,
        };

        axios
          .put(`/api/${id}`, updatedUser)
          .then((response) => {
            console.log(response);

            let maped = users.map((user) =>
              user.id === response.data.id ? response.data : user
            );
            setUsers(maped);
          })
          .catch((error) => console.log(error));
        setUser({
          name: "",
          email: "",
          gender: "",
          address: { street: "", city: "" },
          phone: "",
        });
        setOpen(false);
        setUpdate(false);
      }
    } else {
      if (!user.name.trim()) {
        alert("Name is required");
      } else if (!validator.isEmail(user.email)) {
        alert("Email is invalid");
      } else if (!["male", "female"].includes(user.gender.toLowerCase())) {
        alert("Gender should be either male or female");
      } else if (!user.address.street.trim() || !user.address.city.trim()) {
        alert("Street and City are required");
      } else if (!validator.isMobilePhone(user.phone)) {
        alert("Phone number is invalid");
      } else {
        const newUser = {
          name: user.name,
          emai: user.email,

          gender: user.gender,
          phone: user.phone,
          address: user.address,
        };
        axios
          .post("/api", newUser)
          .then((response) => setUsers([...users, response.data]))
          .catch((error) => console.log(error));

        setUser({
          name: "",
          email: "",
          gender: "",
          address: { street: "", city: "" },
          phone: "",
        });
        setOpen(false);
      }
    }
  };

  const handleChange = async (data: Json) => {
    setOpen(true);

    axios
      .get(`./api/${data.id}`)
      .then((res) => {
        return setUser(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {pieChart ? (
        <Chart
          dataLength={users.length}
          pieChart={pieChart}
          setPieChart={setPieChart}
        />
      ) : open ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "700px",
          }}
        >
          <Form
            form={form}
            initialValues={user}
            onValuesChange={(changedValues, allValues) =>
              setUser({ ...user, ...allValues })
            }
            style={{
              padding: "30px",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              maxWidth: "700px",
            }}
          >
            <Form.Item
              label="Name"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginBottom: "10px", width: "100%" }}
            >
              <Input
                style={{ width: "100%" }}
                name="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginBottom: "10px", width: "100%" }}
            >
              <Input
                style={{ width: "100%" }}
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </Form.Item>
            <Form.Item
              label="Gender"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginBottom: "10px", width: "100%" }}
            >
              <Select
                style={{ width: "100%" }}
                value={user.gender}
                onChange={(value) => setUser({ ...user, gender: value })}
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Address"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginBottom: "10px", width: "100%" }}
            >
              <Input
                style={{ width: "100%" }}
                value={user.address.street}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: { ...user.address, street: e.target.value },
                  })
                }
              />
            </Form.Item>
            <Form.Item
              label="City"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginBottom: "10px", width: "100%" }}
            >
              <Input
                style={{ width: "100%" }}
                value={user.address.city}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: { ...user.address, city: e.target.value },
                  })
                }
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginBottom: "10px", width: "100%" }}
            >
              <Input
                style={{ width: "100%" }}
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <Button
                onClick={handleAddUser}
                type="primary"
                htmlType="submit"
                style={{ marginRight: "1rem" }}
              >
                Submit
              </Button>
              <Button onClick={() => setOpen(!open)}>Close</Button>
            </div>
          </Form>
        </div>
      ) : (
        <div style={{ padding: "10px " }}>
          <div style={{ marginBlock: "10px" }}>
            <Button
              style={{
                backgroundColor: "red",
                color: "white",
              }}
              onClick={handleOpen}
            >
              Add
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              onClick={() => setPieChart(!pieChart)}
            >
              Open Pie Chart
            </Button>
          </div>

          <Table
            pagination={{ pageSize: 8 }}
            onRow={(record) => ({
              onDoubleClick: () => {
                return handleChange(record), setUpdate(true), setId(record.id);
              },
            })}
            dataSource={users}
            columns={columns}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
