const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  season: {
    type: String,
    required: true,
    enum: ['Kharif', 'Rabi', 'Zaid']
  },
  soilType: {
    type: String,
    required: true
  },
  minTemperature: {
    type: Number,
    required: true
  },
  maxTemperature: {
    type: Number,
    required: true
  },
  minRainfall: {
    type: Number,
    required: true
  },
  maxRainfall: {
    type: Number,
    required: true
  },
  minpH: {
    type: Number,
    required: true
  },
  maxpH: {
    type: Number,
    required: true
  },
  growthDuration: {
    type: Number, // in days
    required: true
  },
  waterRequirement: {
    type: Number, // in mm
    required: true
  },
  diseases: [{
    name: String,
    symptoms: [String],
    treatment: String,
    preventiveMeasures: [String]
  }],
  fertilizers: [{
    stage: String,
    type: String,
    quantity: Number,
    unit: String,
    timing: String
  }],
  cultivationPractices: [{
    stage: String,
    practice: String,
    description: String,
    timing: String
  }],
  yield: {
    min: Number,
    max: Number,
    unit: String
  },
  marketValue: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt timestamp
cropSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get crop recommendations based on environmental conditions
cropSchema.statics.getRecommendations = async function(conditions) {
  const {
    temperature,
    rainfall,
    pH,
    season,
    soilType
  } = conditions;

  return this.find({
    minTemperature: { $lte: temperature },
    maxTemperature: { $gte: temperature },
    minRainfall: { $lte: rainfall },
    maxRainfall: { $gte: rainfall },
    minpH: { $lte: pH },
    maxpH: { $gte: pH },
    season: season,
    soilType: soilType
  }).sort({ 'marketValue.min': -1 });
};

// Method to get disease information for a specific crop
cropSchema.methods.getDiseaseInfo = function(diseaseName) {
  return this.diseases.find(disease => 
    disease.name.toLowerCase() === diseaseName.toLowerCase()
  );
};

// Virtual for estimated profit range
cropSchema.virtual('estimatedProfit').get(function() {
  const minProfit = (this.marketValue.min * this.yield.min) - 
                   (this.waterRequirement * 0.1); // Basic profit calculation
  const maxProfit = (this.marketValue.max * this.yield.max) - 
                   (this.waterRequirement * 0.1);
  
  return {
    min: minProfit,
    max: maxProfit,
    currency: this.marketValue.currency
  };
});

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop; 