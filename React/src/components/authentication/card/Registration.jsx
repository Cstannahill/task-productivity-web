import React from "react";
import { Link } from "react-router-dom";
import AuthCardLayout from "../../../layouts/AuthCardLayout";
import RegistrationForm from "../RegistrationForm";
import { Button } from "react-bootstrap";

const Registration = () => {
  return (
    <AuthCardLayout
      registration={true}
      leftSideContent={
        <p className="pt-3 text-white">
          Have an account?
          <br />
          <Button
            as={Link}
            variant="outline-light"
            className="mt-2 px-4"
            to="/login"
          >
            Log In
          </Button>
        </p>
      }
      footer={false}
    >
      <h3>Register</h3>
      <RegistrationForm layout="card" hasLabel />
    </AuthCardLayout>
  );
};

export default Registration;
