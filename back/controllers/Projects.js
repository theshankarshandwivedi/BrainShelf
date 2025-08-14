const Project = require("../models/Project");
const User = require("../models/User");

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ _id: -1 }); // Latest first
        
        return res.status(200).json({
            success: true,
            projects: projects
        });

    } catch (error) {
        console.error("Get projects error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching projects"
        });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            project: project
        });

    } catch (error) {
        console.error("Get project error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching project"
        });
    }
};
