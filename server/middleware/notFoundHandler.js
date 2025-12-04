const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    msg: "Request URL you are looking for is not found!",
  });
};

export default notFoundHandler;
