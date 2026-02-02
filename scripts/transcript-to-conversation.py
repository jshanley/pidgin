#!/usr/bin/env python3
"""
Enrich a conversation markdown file with tool calls from a Claude transcript.

This script extracts user messages, assistant messages, and tool interactions
from a JSONL transcript file and formats them according to pidgin conventions.

Format conventions:
- ## user - user text messages
- ## assistant - assistant text responses
- ## tool (ToolName) - tool invocation with parameters, blank line, then result
"""

import json
import sys

def extract_messages(jsonl_path, start_text=None):
    """Extract messages from transcript, optionally starting from a specific user message."""
    messages = []
    started = start_text is None

    with open(jsonl_path) as f:
        for line in f:
            msg = json.loads(line)
            if msg.get('type') not in ('user', 'assistant'):
                continue

            # Check for start trigger
            if not started and msg['type'] == 'user':
                content = msg['message']['content']
                if isinstance(content, str) and start_text in content:
                    started = True
                elif isinstance(content, list):
                    for item in content:
                        if item.get('type') == 'text' and start_text in item.get('text', ''):
                            started = True
                            break

            if started:
                messages.append(msg)

    return messages

def format_tool_params(tool_input):
    """Format tool parameters as key: value lines."""
    lines = []
    for key, value in tool_input.items():
        if isinstance(value, str) and '\n' in value:
            lines.append(f"{key}: |")
            for vline in value.split('\n'):
                lines.append(f"  {vline}")
        else:
            lines.append(f"{key}: {value}")
    return '\n'.join(lines)

def format_messages(messages):
    """Format messages as enriched markdown."""
    output = []
    pending_tools = {}  # tool_id -> tool_use info

    for msg in messages:
        content = msg['message']['content']

        if msg['type'] == 'user':
            if isinstance(content, str):
                # Skip command messages
                if '<command-name>' in content or '<local-command' in content:
                    continue
                output.append(f"## user\n\n{content}\n")
            elif isinstance(content, list):
                for item in content:
                    if item.get('type') == 'text':
                        text = item['text']
                        # Skip system/command stuff
                        if '<command-name>' in text or '<local-command' in text:
                            continue
                        if text.strip():
                            output.append(f"## user\n\n{text}\n")
                    elif item.get('type') == 'tool_result':
                        tool_id = item.get('tool_use_id')
                        if tool_id in pending_tools:
                            tool = pending_tools.pop(tool_id)
                            result = item.get('content', '')
                            if isinstance(result, list):
                                result = '\n'.join(r.get('text', str(r)) for r in result)

                            tool_section = f"## tool ({tool['name']})\n\n"
                            tool_section += format_tool_params(tool['input'])
                            tool_section += f"\n\n{result}\n"
                            output.append(tool_section)

        elif msg['type'] == 'assistant':
            if isinstance(content, list):
                for item in content:
                    if item.get('type') == 'text':
                        text = item['text']
                        if text.strip():
                            output.append(f"## assistant\n\n{text}\n")
                    elif item.get('type') == 'tool_use':
                        # Store for later when we get the result
                        pending_tools[item['id']] = {
                            'name': item['name'],
                            'input': item['input']
                        }
                    # Skip thinking blocks

    return '\n'.join(output)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: enrich.py <transcript.jsonl> [start_text]")
        sys.exit(1)

    jsonl_path = sys.argv[1]
    start_text = sys.argv[2] if len(sys.argv) > 2 else None

    messages = extract_messages(jsonl_path, start_text)
    print(f"# Extracted {len(messages)} messages", file=sys.stderr)

    formatted = format_messages(messages)
    print(formatted)
