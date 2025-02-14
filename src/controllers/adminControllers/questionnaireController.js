import { configDotenv } from "dotenv";
import { Questionnaire } from "../../db/models.js";
configDotenv();

export const getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.findAll();
    res.json(questionnaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setNewQuestionnaire = async (req, res) => {
  try {
    const { title, description, no_of_questions, time_to_complete } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required!"
      });
    }
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required!"
      });
    }
    if (!no_of_questions) {
      return res.status(400).json({
        success: false,
        message: "Number of questions is required!"
      });
    }
    if (!time_to_complete) {
      return res.status(400).json({
        success: false,
        message: "Time to complete is required!"
      });
    }

    // Generate a unique ID (using a combination of timestamp and sanitized title)
    const id = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    // Create the questionnaire and get the created record
    const newQuestionnaire = await Questionnaire.create({
      id,
      title,
      description,
      no_of_questions,
      time_to_complete
    });

    // Return the created record
    return res.status(201).json({
      success: true,
      data: newQuestionnaire
    });

  } catch (error) {
    console.error('Error creating questionnaire:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to create questionnaire",
      error: error.message
    });
  }
};

export const updateQuestionnaire = async (req, res) => {

    try {
    const { id } = req.params;
    const { title, description, no_of_questions, time_to_complete } = req.body;

    // Find the questionnaire
    const questionnaire = await Questionnaire.findByPk(id);

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    // Validate required fields
    if (!title || !no_of_questions) {
      return res.status(400).json({
        error: 'Title and number of questions are required'
      });
    }

    // Update the questionnaire
    const updatedQuestionnaire = await questionnaire.update({
      title,
      description,
      no_of_questions,
      time_to_complete
    });

    return res.json(updatedQuestionnaire);

  } catch (error) {
    console.error('Error updating questionnaire:', error);
    return res.status(500).json({
      error: 'An error occurred while updating the questionnaire'
    });
  }

}

export const deleteQuestionnaire = async (req, res) => {

    const qid = req.params.id;

  try {
    // Find and delete the item by ID
    const deletedItem = await Questionnaire.destroy({
      where: { id: qid },
    });

    // If no rows are affected, it means the item wasn't found
    if (!deletedItem) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Send a success response
    res.status(200).json({ message: 'Questionnaire deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
