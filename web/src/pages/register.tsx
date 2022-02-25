import React from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";

interface registerProps {}

const REGISTER_MUTATION = `
    mutation Mutation($options: UsernamePasswordInput!) {
    register(options: $options) {
      errors {
        message
        field
      }
      user {
        username
        updatedAt
        createdAt
        id
      }
    }
  }`;

export const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUTATION);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={(value) => {
          console.log(value);
          return register({
            options: {
              password: value.password,
              username: value.username,
            },
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              isLoading={isSubmitting}
              color={"white"}
              bgColor="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
