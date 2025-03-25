import { Button, Input } from "@chakra-ui/react";
// import { useForm } from "react-hook-form";
import "./reqForm.css";
import { useDispatch } from "react-redux";
import { fetchTasks } from "./../../redux/operators";
import { AppDispatch } from "./../../redux/store";
import { useState } from "react";

export const RequestForm = () => {
  const [value, setValue] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(fetchTasks(value));
  };

  return (
    <div className="form-container">

    <form className="form" onSubmit={handleSubmit}>
      <Input
        className="input"
        placeholder="Enter repo URL"
        value={value}
        onChange={handleChange}
      />
      <Button className="button" type="submit">
        Load issues
      </Button>
    </form>
    </div>
  );
};
