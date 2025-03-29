// ... existing code ...

// Import error middleware
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const { validateResourceExists } = require('./utils/errorHandler');

// ... existing code ...

// Example route that logs IDs and checks if they exist
app.get('/api/resource/:id', async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    console.log(`Accessing resource with ID: ${resourceId}`);
    
    // Check if resource exists (implement your own lookup function)
    const exists = await validateResourceExists(resourceId, async (id) => {
      // Replace with your actual lookup logic
      const resource = await YourModel.findById(id);
      return !!resource;
    });
    
    if (!exists) {
      return res.status(404).json({ 
        error: 'Resource not found',
        resourceId
      });
    }
    
    // Continue processing if resource exists
    return res.json({ success: true, message: 'Resource found', resourceId });
  } catch (error) {
    next(error);
  }
});

// These should be registered after all other routes
app.use(notFoundHandler);
app.use(errorHandler);

// ... existing code ...
