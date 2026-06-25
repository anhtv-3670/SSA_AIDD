// Pure validation for the Write Kudo form — no React, no DOM, fully unit-testable.
// EC-1..4: all required fields emit individual errors; EC-5 is enforced in the component.

export interface WriteKudoForm {
  recipient: string;
  danhHieu: string;
  content: string;
  hashtags: string[];
}

export interface WriteKudoErrors {
  recipient?: string;
  danhHieu?: string;
  content?: string;
  hashtags?: string;
}

export interface WriteKudoValidationResult {
  errors: WriteKudoErrors;
  isValid: boolean;
}

export function validateWriteKudo(form: WriteKudoForm): WriteKudoValidationResult {
  const errors: WriteKudoErrors = {};

  // EC-2: Người nhận required
  if (!form.recipient.trim()) {
    errors.recipient = "Người nhận không được để trống";
  }

  // Danh hiệu required (design asterisk, clarification confirmed)
  if (!form.danhHieu.trim()) {
    errors.danhHieu = "Danh hiệu không được để trống";
  }

  // EC-3: Nội dung required
  if (!form.content.trim()) {
    errors.content = "Không được để trống";
  }

  // EC-4: Hashtag 1–5
  if (form.hashtags.length === 0) {
    errors.hashtags = "Không được để trống";
  } else if (form.hashtags.length > 5) {
    // Defensive — component should block >5, but validation catches it too
    errors.hashtags = "Tối đa 5 hashtag";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
