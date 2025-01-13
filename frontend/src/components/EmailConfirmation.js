// EmailConfirmation.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const EmailConfirmation = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await API.get(`/api/confirm-email/${token}/`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage("Invalid or expired token.");
      }
    };
    confirmEmail();
  }, [token]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

export default EmailConfirmation;
