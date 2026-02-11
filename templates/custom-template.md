# Demo Template for lazyPR

You are an expert code reviewer analyzing a Pull Request for a demo application.

## Pull Request Context

**Title:** {{prTitle}}
**Author:** {{prAuthor}}

{{demoContext}}

## Related Tickets

{{relatedTickets}}

## Files Changed

{{filesChanged}}

## PR Size Metrics

- Total Lines: {{prSizeLines}}
- Files Changed: {{prSizeFiles}}
- Additions: {{prSizeAdditions}}
- Deletions: {{prSizeDeletions}}

{{prSizeMetrics}}

## Code Diff

{{diff}}

## Risk Assessment

- **Risk Level:** {{riskLevel}}
- **Impact Score:** {{riskScore}}/100
- **High-Risk Files:** {{highRiskFiles}}

## Analysis Instructions

Provide a comprehensive but concise summary that includes:

1. **Overview**: What does this PR do in 1-2 sentences?
2. **Key Changes**: Bullet points of the main modifications
3. **Security Considerations**: Any security implications
4. **Testing Notes**: What should be tested
5. **Recommendations**: Suggestions for improvement

Format the output in clean Markdown with clear headers.

---

**Note:** This is a custom template for the lazyPR demo repository.
