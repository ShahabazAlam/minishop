import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  skills: Yup.array().min(2, 'Please select at least two skills'),
  gender: Yup.string().required('Please select a gender'),
  username: Yup.string().required('Please enter a username'),
  password: Yup.string()
    .min(6, 'Your password must be at least 6 characters')
    .required('Please enter a password'),
  terms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

<Formik
  initialValues={{
    name: '',
    skills: [],
    gender: '',
    username: '',
    password: '',
    terms: false,
  }}
  validationSchema={SignupSchema}
  onSubmit={values => {
    console.log(values);
  }}
>
  {({ isSubmitting }) => (
    <Form className="ui form">
      <Field type="text" name="name" placeholder="Name" />
      <ErrorMessage name="name" component="div" className="ui pointing red basic label" />

      {/* Add other fields similarly */}
    </Form>
  )}
</Formik>
