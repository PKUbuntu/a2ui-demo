/**
 * Canvas Page Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('jsonl-input');
  const outputEl = document.getElementById('canvas-output');
  const renderBtn = document.getElementById('render-btn');
  const clearBtn = document.getElementById('clear-btn');
  const exampleSelect = document.getElementById('example-select');
  
  const renderer = new A2UIRenderer(outputEl);

  // 示例数据 - JSONL 格式（每行一个完整的 JSON）
  const examples = {
    hello: `{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","subtitle","button"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"👋 Hello A2UI"},"usageHint":"h1"}}},{"id":"subtitle","component":{"Text":{"text":{"literalString":"这是一个简单的 A2UI 示例"},"usageHint":"body"}}},{"id":"button","component":{"Button":{"child":"btn_text","action":{"name":"greet"}}}},{"id":"btn_text","component":{"Text":{"text":{"literalString":"点击我"}}}}]}}
{"beginRendering":{"surfaceId":"main","root":"root"}}`,

    form: `{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","name_field","email_field","button_row"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"📝 注册表单"},"usageHint":"h2"}}},{"id":"name_field","component":{"TextField":{"label":{"literalString":"姓名"},"text":{"path":"/form/name"}}}},{"id":"email_field","component":{"TextField":{"label":{"literalString":"邮箱"},"text":{"path":"/form/email"},"textFieldType":"email"}}},{"id":"button_row","component":{"Row":{"children":{"explicitList":["submit_btn","cancel_btn"]}}}},{"id":"submit_btn","component":{"Button":{"child":"submit_text","action":{"name":"submit"}}}},{"id":"submit_text","component":{"Text":{"text":{"literalString":"提交"}}}},{"id":"cancel_btn","component":{"Button":{"child":"cancel_text"}}},{"id":"cancel_text","component":{"Text":{"text":{"literalString":"取消"}}}}]}}
{"dataModelUpdate":{"surfaceId":"main","contents":[{"key":"form","valueMap":[{"key":"name","valueString":""},{"key":"email","valueString":""}]}]}}
{"beginRendering":{"surfaceId":"main","root":"root"}}`,

    list: `{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","card1","card2","card3"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"📋 任务列表"},"usageHint":"h2"}}},{"id":"card1","component":{"Card":{"child":"card1_content"}}},{"id":"card1_content","component":{"Row":{"children":{"explicitList":["check1","task1"]}}}},{"id":"check1","component":{"CheckBox":{"label":{"literalString":""},"value":true}}},{"id":"task1","component":{"Text":{"text":{"literalString":"完成 A2UI 文档阅读"}}}},{"id":"card2","component":{"Card":{"child":"card2_content"}}},{"id":"card2_content","component":{"Row":{"children":{"explicitList":["check2","task2"]}}}},{"id":"check2","component":{"CheckBox":{"label":{"literalString":""},"value":false}}},{"id":"task2","component":{"Text":{"text":{"literalString":"编写示例代码"}}}},{"id":"card3","component":{"Card":{"child":"card3_content"}}},{"id":"card3_content","component":{"Row":{"children":{"explicitList":["check3","task3"]}}}},{"id":"check3","component":{"CheckBox":{"label":{"literalString":""},"value":false}}},{"id":"task3","component":{"Text":{"text":{"literalString":"部署演示网站"}}}}]}}
{"beginRendering":{"surfaceId":"main","root":"root"}}`,

    card: `{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","card_row"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"🎨 卡片布局"},"usageHint":"h2"}}},{"id":"card_row","component":{"Row":{"children":{"explicitList":["card1","card2"]}}}},{"id":"card1","component":{"Card":{"child":"card1_content"}}},{"id":"card1_content","component":{"Column":{"children":{"explicitList":["c1_title","c1_desc","c1_btn"]}}}},{"id":"c1_title","component":{"Text":{"text":{"literalString":"特性一"},"usageHint":"h3"}}},{"id":"c1_desc","component":{"Text":{"text":{"literalString":"声明式 UI，让 AI 轻松构建界面"}}}},{"id":"c1_btn","component":{"Button":{"child":"c1_btn_text"}}},{"id":"c1_btn_text","component":{"Text":{"text":{"literalString":"了解更多"}}}},{"id":"card2","component":{"Card":{"child":"card2_content"}}},{"id":"card2_content","component":{"Column":{"children":{"explicitList":["c2_title","c2_desc","c2_btn"]}}}},{"id":"c2_title","component":{"Text":{"text":{"literalString":"特性二"},"usageHint":"h3"}}},{"id":"c2_desc","component":{"Text":{"text":{"literalString":"实时更新，流式渲染界面变化"}}}},{"id":"c2_btn","component":{"Button":{"child":"c2_btn_text"}}},{"id":"c2_btn_text","component":{"Text":{"text":{"literalString":"了解更多"}}}}]}}
{"beginRendering":{"surfaceId":"main","root":"root"}}`
  };

  // 渲染按钮
  renderBtn.addEventListener('click', () => {
    const jsonl = inputEl.value.trim();
    if (!jsonl) {
      alert('请输入 A2UI JSONL 消息');
      return;
    }
    
    renderer.clear();
    try {
      renderer.processJSONL(jsonl);
    } catch (e) {
      outputEl.innerHTML = `<div class="placeholder" style="color: #F44336;">
        <p>❌ 渲染失败: ${e.message}</p>
      </div>`;
    }
  });

  // 清空按钮
  clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    renderer.clear();
    outputEl.innerHTML = '<div class="placeholder"><p>👈 在左侧输入 A2UI JSONL 消息，点击"渲染"查看效果</p></div>';
  });

  // 示例选择
  exampleSelect.addEventListener('change', (e) => {
    const example = e.target.value;
    if (example && examples[example]) {
      inputEl.value = examples[example];
    }
  });

  // 示例卡片点击
  document.querySelectorAll('.example-card').forEach(card => {
    card.addEventListener('click', () => {
      const example = card.dataset.example;
      if (examples[example]) {
        inputEl.value = examples[example];
        // 自动渲染
        renderBtn.click();
      }
    });
  });
});