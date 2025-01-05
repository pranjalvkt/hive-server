const validateIdParam = (req, res, next) => {
    const { id } = req.params;    
  
    if (!id) {
      return res.status(400).json({ message: "ID parameter is required." });
    }
    
    next();
};

module.exports = validateIdParam;