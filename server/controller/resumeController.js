

import imagekit from "../config/imageKit.js";
import Resume from "../models/resume.js";
import fs from 'fs'
import User from "../models/user.js"
import { sendResumeDownloadEmail } from "../utils/emailService.js"

export const createResume = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.body.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required to create a resume" });
        }

        const newResume = await Resume.create({
            ...req.body,
            userId
        });

        res.status(201).json(newResume);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserResumes = async (req, res) => {
    try {
        const userId = req.params.userId || (req.user ? req.user._id : null);
        const resumes = await Resume.find({ userId });
        res.status(200).json(resumes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findByIdAndDelete(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Public: get resume by id (no auth)
export const getPublicResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    return res.status(200).json(resume);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// controller for updating a resume
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground, accentColor, selectedTemplate } = req.body;
    const image = req.file;


    let resumeDataCopy = JSON.parse(resumeData);

    if(image){
      const imagebufferdata =fs.createReadStream(image.path)
        const response = await imagekit.files.upload({
          file:imagebufferdata,
          fileName: 'resume.png',
          folder: 'user-resumes',
          transformation:{
            pre : 'w-300,h-300,fo-face,z-0.75' +(removeBackground?',e-bgremove':'')
          }
  });
   resumeDataCopy.personal_info.image = response.url;
    }

    const updateData = {
      ...resumeDataCopy,
      accent_color: accentColor || '#4f46e5',
      template: selectedTemplate || 'Classic'
    };

    const resume = await Resume.findByIdAndUpdate(
      { userId, _id: resumeId },
      updateData,
      { new: true }
    );

    return res.status(200).json({ message: 'Saved successfully', resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Track resume download and send email
export const trackResumeDownload = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const userId = req.user._id;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send download email
    sendResumeDownloadEmail(user.email, user.name, resume.title);

    return res.status(200).json({ message: "Download tracked successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
