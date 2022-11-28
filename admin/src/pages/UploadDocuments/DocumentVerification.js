import React from "react";
import FormProvider from "../../context";
import DocumentVerificationForm from "./components/DocumentVerificationForm";

const DocumentVerification = ({ pageProps }) => {
  return (
    <FormProvider>
      <DocumentVerificationForm {...pageProps} />
    </FormProvider>
  );
}

export default DocumentVerification;
