module.exports = {
  port: 3000,
  baseUrl: 'http://192.168.1.106:4000/api',
  imageUrl: 'http://192.168.1.106:4000/',
  fileUrl: 'http://192.168.1.106:4000',
  filesFormats: [".jpeg", ".jpg", ".png", "image/png", "image/jpg", "image/jpeg"],
  filesFormatsPdf: [".pdf", "image/*", "application/pdf"],
  quillConfig: {
    modules: {
      toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["clean"],
      ],
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
      },
    },
    formats: [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "video",
    ],
    placeholder: "Write product description here"
  },
  subscriptionAddOns: [
    {
      id: 1,
      title: 'Marketing',
      amount: 1000,
      checked: false
    },
    {
      id: 2,
      title: 'Website',
      amount: 2000,
      checked: false
    },
    {
      id: 3,
      title: 'Live Selling',
      amount: 3000,
      checked: false
    },
    {
      id: 4,
      title: 'Newsletter',
      amount: 4000,
      checked: false
    },
  ]
}