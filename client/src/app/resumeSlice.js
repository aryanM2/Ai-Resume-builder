import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeAPI, aiAPI } from '../services/api';

// Async thunks
export const createResume = createAsyncThunk(
  'resume/create',
  async (resumeData, { rejectWithValue }) => {
    try {
      const response = await resumeAPI.createResume(resumeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create resume');
    }
  }
);

export const getUserResumes = createAsyncThunk(
  'resume/getUserResumes',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await resumeAPI.getUserResumes(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch resumes');
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/update',
  async (resumeData, { rejectWithValue }) => {
    try {
      const response = await resumeAPI.updateResume(resumeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update resume');
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resume/delete',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await resumeAPI.deleteResume(resumeId);
      return resumeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete resume');
    }
  }
);

export const enhanceSummary = createAsyncThunk(
  'resume/enhanceSummary',
  async (content, { rejectWithValue }) => {
    try {
      const response = await aiAPI.enhanceSummary({ userContent: content });
      return response.data.enhancedSummary;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enhance summary');
    }
  }
);

export const enhanceJD = createAsyncThunk(
  'resume/enhanceJD',
  async (content, { rejectWithValue }) => {
    try {
      const response = await aiAPI.enhanceJD({ userContent: content });
      return response.data.enhancedJD;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enhance job description');
    }
  }
);

export const enhanceProject = createAsyncThunk(
  'resume/enhanceProject',
  async (content, { rejectWithValue }) => {
    try {
      const response = await aiAPI.enhanceProject({ userContent: content });
      return response.data.enhancedProject;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enhance project description');
    }
  }
);

export const analyzeAtsScore = createAsyncThunk(
  'resume/analyzeAts',
  async ({ resumeText, jobDescription }, { rejectWithValue }) => {
    try {
      const response = await aiAPI.analyzeAts({ resumeText, jobDescription });
      return response.data.analysisResult;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to analyze ATS score');
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    resumes: [],
    currentResume: null,
    isLoading: false,
    error: null,
    enhancedSummary: null,
    enhancedJD: null,
    enhancedProject: null,
    isAtsLoading: false,
    atsAnalysisResult: null,
    atsError: null,
  },
  reducers: {
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    clearEnhancedContent: (state) => {
      state.enhancedSummary = null;
      state.enhancedJD = null;
      state.enhancedProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Resume
      .addCase(createResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes.push(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get User Resumes
      .addCase(getUserResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload;
      })
      .addCase(getUserResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Resume
      .addCase(updateResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.resumes.findIndex(r => r._id === action.payload.resume._id);
        if (index !== -1) {
          state.resumes[index] = action.payload.resume;
        }
        state.currentResume = action.payload.resume;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Resume
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter(r => r._id !== action.payload);
      })
      // Enhance Summary
      .addCase(enhanceSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enhanceSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enhancedSummary = action.payload;
      })
      .addCase(enhanceSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Enhance JD
      .addCase(enhanceJD.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enhanceJD.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enhancedJD = action.payload;
      })
      .addCase(enhanceJD.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Enhance Project
      .addCase(enhanceProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enhanceProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enhancedProject = action.payload;
      })
      .addCase(enhanceProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Analyze ATS Score
      .addCase(analyzeAtsScore.pending, (state) => {
        state.isAtsLoading = true;
        state.atsError = null;
        state.atsAnalysisResult = null;
      })
      .addCase(analyzeAtsScore.fulfilled, (state, action) => {
        state.isAtsLoading = false;
        state.atsAnalysisResult = action.payload;
      })
      .addCase(analyzeAtsScore.rejected, (state, action) => {
        state.isAtsLoading = false;
        state.atsError = action.payload;
        state.atsAnalysisResult = null;
      });
  },
});

export const { setCurrentResume, clearEnhancedContent, clearError } = resumeSlice.actions;
export default resumeSlice.reducer;
