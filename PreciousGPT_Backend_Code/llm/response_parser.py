# llm/response_parser.py
import json
import re
from typing import Optional, Dict, Any
from utils.logger import get_logger

logger = get_logger(__name__)


class ResponseParser:
    """
    Extracts and cleans JSON from raw LLM text output.
    LLMs often wrap JSON in markdown code blocks or add preamble text.
    This parser handles all common failure patterns.
    """

    @staticmethod
    def extract_json(raw_text: str) -> Optional[Dict[str, Any]]:
        """
        Attempt multiple strategies to extract valid JSON from LLM output.
        Returns parsed dict or None if all strategies fail.
        """
        # Strategy 1: Try direct parse (ideal case — model returned pure JSON)
        try:
            return json.loads(raw_text.strip())
        except json.JSONDecodeError:
            pass

        # Strategy 2: Extract from markdown code block ```json ... ```
        code_block_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw_text, re.DOTALL)
        if code_block_match:
            try:
                return json.loads(code_block_match.group(1))
            except json.JSONDecodeError:
                pass

        # Strategy 3: Find the first { and last } and extract
        first_brace = raw_text.find("{")
        last_brace = raw_text.rfind("}")
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            candidate = raw_text[first_brace:last_brace + 1]
            try:
                return json.loads(candidate)
            except json.JSONDecodeError:
                pass

        # Strategy 4: Fix common JSON issues (trailing commas, single quotes)
        cleaned = ResponseParser._clean_json_string(raw_text)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        logger.warning("All JSON extraction strategies failed", raw_preview=raw_text[:200])
        return None

    @staticmethod
    def _clean_json_string(text: str) -> str:
        """Fix common LLM JSON output issues."""
        # Remove trailing commas before } or ]
        text = re.sub(r",\s*([}\]])", r"\1", text)
        # Replace single quotes with double quotes (careful — only for keys/values)
        text = re.sub(r"'([^']*)'", r'"\1"', text)
        # Extract JSON portion
        first_brace = text.find("{")
        last_brace = text.rfind("}")
        if first_brace != -1 and last_brace != -1:
            return text[first_brace:last_brace + 1]
        return text
