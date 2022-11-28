module.exports = {
  port: 3000,
  baseUrl: 'http://192.168.1.106:4000/api',
  imageUrl: 'http://192.168.1.106:4000/',
  color: ["yellow", 'purple', 'pink', 'sky-blue', 'green', 'orange', 'blue', 'red'],
  razorCheckoutUrl: 'https://checkout.razorpay.com/v1/checkout.js',
  DEV: document.domain === 'localhost',
  vat: 0.0523,
  deliveryCharge: 20.15
  // quillConfig: {
  //   modules: {
  //     toolbar: [
  //       [{ header: "1" }, { header: "2" }, { font: [] }],
  //       [{ size: [] }],
  //       ["bold", "italic", "underline", "strike", "blockquote"],
  //       [
  //         { list: "ordered" },
  //         { list: "bullet" },
  //         { indent: "-1" },
  //         { indent: "+1" },
  //       ],
  //       ["link", "image", "video"],
  //       ["clean"],
  //     ],
  //     clipboard: {
  //       // toggle to add extra line breaks when pasting HTML:
  //       matchVisual: false,
  //     },
  //   },
  //   formats: [
  //     "header",
  //     "font",
  //     "size",
  //     "bold",
  //     "italic",
  //     "underline",
  //     "strike",
  //     "blockquote",
  //     "list",
  //     "bullet",
  //     "indent",
  //     "link",
  //     "image",
  //     "video",
  //   ],
  //   placeholder: "Write product description here"
  // },

}