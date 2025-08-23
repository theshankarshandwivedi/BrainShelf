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

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.user; // From auth middleware
        
        // Find the project
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Check if the user owns this project
        if (project.user !== username) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own projects"
            });
        }

        // Delete the project
        await Project.findByIdAndDelete(id);
        
        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.error("Delete project error:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting project"
        });
    }
};
