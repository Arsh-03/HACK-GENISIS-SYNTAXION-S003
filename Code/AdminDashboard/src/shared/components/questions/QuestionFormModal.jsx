import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { MOCK_SUBJECTS, MOCK_DIFFICULTIES, MOCK_QUESTION_TYPES, MOCK_BLOOMS_TAXONOMY } from '../../../services/mockQuestionBank';
import { FileText, Plus, Trash2, Edit, CheckCircle2 } from 'lucide-react';

export function QuestionFormModal({
  isOpen,
  onClose,
  questionToEdit,
  onSave
}) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    prompt: '',
    subject: MOCK_SUBJECTS[0],
    topic: 'General Topics',
    chapter: 'Section 1',
    difficulty: 'Medium',
    marks: 2,
    type: 'Multiple Choice',
    source: 'Manual',
    status: 'Active',
    version: 'v1.0',
    bloomsTaxonomy: 'Analyze',
    explanation: '',
    correctAnswerText: '',
    options: [
      { id: 'opt-a', text: '', isCorrect: true },
      { id: 'opt-b', text: '', isCorrect: false },
      { id: 'opt-c', text: '', isCorrect: false },
      { id: 'opt-d', text: '', isCorrect: false }
    ]
  });

  useEffect(() => {
    if (questionToEdit) {
      setFormData({
        id: questionToEdit.id || '',
        title: questionToEdit.title || '',
        prompt: questionToEdit.prompt || '',
        subject: questionToEdit.subject || MOCK_SUBJECTS[0],
        topic: questionToEdit.topic || 'General Topics',
        chapter: questionToEdit.chapter || 'Section 1',
        difficulty: questionToEdit.difficulty || 'Medium',
        marks: questionToEdit.marks || 2,
        type: questionToEdit.type || 'Multiple Choice',
        source: questionToEdit.source || 'Manual',
        status: questionToEdit.status || 'Active',
        version: questionToEdit.version || 'v1.0',
        bloomsTaxonomy: questionToEdit.bloomsTaxonomy || 'Analyze',
        explanation: questionToEdit.explanation || '',
        correctAnswerText: questionToEdit.correctAnswerText || '',
        options: questionToEdit.options?.length > 0 ? questionToEdit.options : [
          { id: 'opt-a', text: '', isCorrect: true },
          { id: 'opt-b', text: '', isCorrect: false }
        ]
      });
    } else {
      setFormData({
        id: `Q-2026-0${Math.floor(100 + Math.random() * 900)}`,
        title: '',
        prompt: '',
        subject: MOCK_SUBJECTS[0],
        topic: 'Core Fundamentals',
        chapter: 'Chapter 1',
        difficulty: 'Medium',
        marks: 2,
        type: 'Multiple Choice',
        source: 'Manual',
        status: 'Active',
        version: 'v1.0',
        bloomsTaxonomy: 'Analyze',
        explanation: '',
        correctAnswerText: '',
        options: [
          { id: 'opt-a', text: 'Option A', isCorrect: true },
          { id: 'opt-b', text: 'Option B', isCorrect: false },
          { id: 'opt-c', text: 'Option C', isCorrect: false },
          { id: 'opt-d', text: 'Option D', isCorrect: false }
        ]
      });
    }
  }, [questionToEdit, isOpen]);

  const handleOptionChange = (idx, field, value) => {
    const updatedOptions = [...formData.options];
    if (field === 'isCorrect' && formData.type === 'Multiple Choice') {
      // Uncheck other options for Single Choice
      updatedOptions.forEach((opt, i) => {
        opt.isCorrect = i === idx;
      });
    } else {
      updatedOptions[idx][field] = value;
    }
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleAddOption = () => {
    const char = String.fromCharCode(97 + formData.options.length);
    setFormData({
      ...formData,
      options: [...formData.options, { id: `opt-${char}`, text: '', isCorrect: false }]
    });
  };

  const handleRemoveOption = (idx) => {
    if (formData.options.length <= 2) return;
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={questionToEdit ? `Edit Question: ${questionToEdit.id}` : 'Create New Assessment Question'}
      icon={questionToEdit ? Edit : Plus}
      iconBg="bg-primary/10 text-primary"
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {questionToEdit ? 'Save Changes' : 'Save & Publish Question'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Question Short Title"
          placeholder="e.g. Time Complexity of Binary Search Algorithm"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Full Question Prompt
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Write full problem statement or scenario prompt here..."
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Select
            label="Subject"
            options={MOCK_SUBJECTS}
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <Select
            label="Question Format"
            options={MOCK_QUESTION_TYPES}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <Select
            label="Difficulty"
            options={MOCK_DIFFICULTIES}
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          />
          <Input
            label="Marks (Pts)"
            type="number"
            value={formData.marks}
            onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value, 10) || 1 })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Bloom's Taxonomy"
            options={MOCK_BLOOMS_TAXONOMY}
            value={formData.bloomsTaxonomy}
            onChange={(e) => setFormData({ ...formData, bloomsTaxonomy: e.target.value })}
          />
          <Input
            label="Topic / Chapter"
            placeholder="e.g. Chemistry & Algorithms"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            required
          />
        </div>

        {/* Dynamic Options for Multiple Choice & Multiple Correct */}
        {(formData.type === 'Multiple Choice' || formData.type === 'Multiple Correct') && (
          <div className="space-y-2 pt-2 border-t border-outline-variant/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Options & Answer Key ({formData.type === 'Multiple Choice' ? 'Single Choice' : 'Multi-Select'})
              </label>
              <Button type="button" variant="outline" size="sm" icon={Plus} onClick={handleAddOption}>
                Add Option
              </Button>
            </div>

            <div className="space-y-2">
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type={formData.type === 'Multiple Choice' ? 'radio' : 'checkbox'}
                    name="correctOption"
                    checked={opt.isCorrect}
                    onChange={(e) => handleOptionChange(idx, 'isCorrect', e.target.checked)}
                    className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                    title="Mark as correct answer"
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-md text-xs text-on-surface focus:ring-2 focus:ring-primary"
                    placeholder={`Option ${String.fromCharCode(65 + idx)} text...`}
                    value={opt.text}
                    onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                    required
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-on-surface-variant hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer key for Numerical / Descriptive */}
        {(formData.type === 'Numerical' || formData.type === 'Descriptive') && (
          <div className="pt-2 border-t border-outline-variant/60">
            <Input
              label="Correct Answer Key / Grading Rubric"
              placeholder={formData.type === 'Numerical' ? 'e.g. 10 or [9.8, 10.2]' : 'Enter evaluation rubric criteria...'}
              value={formData.correctAnswerText}
              onChange={(e) => setFormData({ ...formData, correctAnswerText: e.target.value })}
              required
            />
          </div>
        )}

        {/* Solution Rationale */}
        <div className="w-full flex flex-col gap-1.5 pt-2 border-t border-outline-variant/60">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Solution Explanation / Rationale
          </label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-xs text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Explain why the answer is correct for candidate feedback..."
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
}
