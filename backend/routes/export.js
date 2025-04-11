import express from 'express';
import fetchUser from '../middleware/fetchUser.js';
import Nutritiondata from '../Models/Nutrition.js';
import Progress from '../Models/Progress.js'; 
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import stream from 'stream';

const exportrouter = express.Router();

exportrouter.get('/csv/nutrition', fetchUser, async (req, res) => {
  try {
    const data = await Nutritiondata.find({ user: req.userid }).lean();

    const formatted = [];

    data.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      entry.meals.forEach(meal => {
        meal.items.forEach(item => {
          formatted.push({
            Date: date,
            Meal: meal.type,
            Item: item.name,
            Calories: item.calories,
            Protein: item.protein,
            Carbs: item.carbs,
            Fat: item.fat,
          });
        });
      });
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(formatted);

    res.header('Content-Type', 'text/csv');
    res.attachment('nutrition_report.csv');
    return res.send(csv);

  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ success: false, message: 'Failed to export CSV' });
  }
});

// Export PDF for nutrition
exportrouter.get('/pdf/nutrition', fetchUser, async (req, res) => {
  try {
    const data = await Nutritiondata.find({ user: req.userid }).lean();

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const bufferStream = new stream.PassThrough();

    res.setHeader('Content-Disposition', 'attachment; filename=nutrition_report.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(bufferStream);

    doc.fontSize(18).text('NUTRITION REPORT', { align: 'center' });
    doc.moveDown(1.5);

    data.forEach((entry, index) => {
      const date = new Date(entry.date).toLocaleDateString();
      doc.fontSize(14).text(`${index + 1}. Date: ${date}`);
      entry.meals.forEach(meal => {
        doc.fontSize(12).text(`  Meal: ${meal.type}`);
        meal.items.forEach(item => {
          doc.text(`    - ${item.name}: ${item.calories} kcal, ${item.protein}g protein, ${item.carbs}g carbs, ${item.fat}g fat`);
        });
      });
      doc.moveDown();
    });

    doc.end();
    bufferStream.pipe(res);

  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ success: false, message: 'Failed to export PDF' });
  }
});

exportrouter.get('/csv/progress', fetchUser, async (req, res) => {
  try {
    const data = await Progress.find({ user: req.userid }).lean();

    const formatted = data.map(entry => ({
      Date: new Date(entry.date).toLocaleDateString(),
      Weight: entry.weight,
      Chest: entry.measurements?.chest,
      Waist: entry.measurements?.waist,
      Hips: entry.measurements?.hips,
      Arms: entry.measurements?.arms,
      Legs: entry.measurements?.legs,
      RunTime_Seconds: entry.performance?.runTime,
      MaxLift_Kg: entry.performance?.maxLift,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(formatted);

    res.header('Content-Type', 'text/csv');
    res.attachment('progress_report.csv');
    return res.send(csv);

  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ success: false, message: 'Failed to export progress CSV' });
  }
});

// Export PDF for progress
exportrouter.get('/pdf/progress', fetchUser, async (req, res) => {
  try {
    const data = await Progress.find({ user: req.userid }).lean();

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const bufferStream = new stream.PassThrough();

    res.setHeader('Content-Disposition', 'attachment; filename=progress_report.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(bufferStream);

    doc.fontSize(18).text('PROGRESS REPORT', { align: 'center' });
    doc.moveDown(1.5);

    data.forEach((entry, index) => {
      const date = new Date(entry.date).toLocaleDateString();
      doc.fontSize(14).text(`${index + 1}. Date: ${date}`);
      doc.fontSize(12).text(`  - Weight: ${entry.weight} kg`);
      doc.text(`  - Measurements: Chest: ${entry.measurements?.chest}, Waist: ${entry.measurements?.waist}, Hips: ${entry.measurements?.hips}, Arms: ${entry.measurements?.arms}, Legs: ${entry.measurements?.legs}`);
      doc.text(`  - Performance: Run Time: ${entry.performance?.runTime}s, Max Lift: ${entry.performance?.maxLift}kg`);
      doc.moveDown();
    });

    doc.end();
    bufferStream.pipe(res);

  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ success: false, message: 'Failed to export progress PDF' });
  }
});

export default exportrouter;
