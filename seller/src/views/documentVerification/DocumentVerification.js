import React from "react";
import FormProvider from "src/context";
import DocumentVerificationForm from "./components/DocumentVerificationForm";

const DocumentVerification = ({ pageProps }) => {
  return (
    <FormProvider>
      <DocumentVerificationForm {...pageProps} />
    </FormProvider>
  );
}

export default DocumentVerification;
