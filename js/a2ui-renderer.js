/**
 * A2UI Simple Renderer v2
 * 将 A2UI JSONL 消息渲染为 HTML
 */

class A2UIRenderer {
  constructor(container) {
    this.container = container;
    this.surfaces = {};
    this.dataModels = {};
  }

  /**
   * 处理 JSONL 消息
   */
  processJSONL(jsonlText) {
    const lines = jsonlText.trim().split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      try {
        const message = JSON.parse(line);
        this.processMessage(message);
      } catch (e) {
        console.error('Failed to parse line:', line, e);
        this.showError('JSON 解析错误: ' + e.message);
      }
    }
  }

  /**
   * 显示错误
   */
  showError(message) {
    const errorEl = document.createElement('div');
    errorEl.style.cssText = 'background: #ffebee; color: #c62828; padding: 1rem; border-radius: 8px; margin: 0.5rem 0;';
    errorEl.textContent = message;
    this.container.appendChild(errorEl);
  }

  /**
   * 处理单条消息
   */
  processMessage(message) {
    if (message.surfaceUpdate) {
      this.handleSurfaceUpdate(message.surfaceUpdate);
    } else if (message.dataModelUpdate) {
      this.handleDataModelUpdate(message.dataModelUpdate);
    } else if (message.beginRendering) {
      this.handleBeginRendering(message.beginRendering);
    } else if (message.deleteSurface) {
      this.handleDeleteSurface(message.deleteSurface);
    }
  }

  /**
   * 处理 surfaceUpdate
   */
  handleSurfaceUpdate(update) {
    const { surfaceId, components } = update;
    if (!this.surfaces[surfaceId]) {
      this.surfaces[surfaceId] = { components: {}, root: null };
    }
    
    for (const comp of components) {
      this.surfaces[surfaceId].components[comp.id] = comp.component;
    }
  }

  /**
   * 处理 dataModelUpdate
   */
  handleDataModelUpdate(update) {
    const { surfaceId, contents } = update;
    if (!this.dataModels[surfaceId]) {
      this.dataModels[surfaceId] = {};
    }
    
    for (const item of contents) {
      this.dataModels[surfaceId][item.key] = this.valueMapToObject(item.valueMap);
    }
  }

  /**
   * 处理 beginRendering
   */
  handleBeginRendering(render) {
    const { surfaceId, root, styles } = render;
    const surface = this.surfaces[surfaceId];
    if (!surface) {
      this.showError('Surface not found: ' + surfaceId);
      return;
    }

    surface.root = root;
    
    // 应用样式
    if (styles) {
      this.container.style.fontFamily = styles.font || 'inherit';
      if (styles.primaryColor) {
        this.container.style.setProperty('--primary-color', styles.primaryColor);
      }
    }

    // 渲染
    this.container.innerHTML = '';
    try {
      const html = this.renderComponent(surfaceId, root);
      if (html) {
        this.container.appendChild(html);
      }
    } catch (e) {
      console.error('Render error:', e);
      this.showError('渲染错误: ' + e.message);
    }
  }

  /**
   * 渲染组件
   */
  renderComponent(surfaceId, componentId) {
    const surface = this.surfaces[surfaceId];
    const component = surface?.components[componentId];
    
    if (!component) {
      console.warn('Component not found:', componentId);
      return this.renderText('组件未找到: ' + componentId);
    }

    const componentType = Object.keys(component)[0];
    const props = component[componentType];

    try {
      switch (componentType) {
        case 'Text':
          return this.renderText(props);
        case 'Button':
          return this.renderButton(surfaceId, props);
        case 'Column':
          return this.renderColumn(surfaceId, props);
        case 'Row':
          return this.renderRow(surfaceId, props);
        case 'Card':
          return this.renderCard(surfaceId, props);
        case 'TextField':
          return this.renderTextField(props);
        case 'Divider':
          return this.renderDivider(props);
        case 'Image':
          return this.renderImage(props);
        case 'List':
          return this.renderList(surfaceId, props);
        case 'CheckBox':
          return this.renderCheckBox(props);
        default:
          console.warn('Unknown component type:', componentType);
          return this.renderUnknown(componentType);
      }
    } catch (e) {
      console.error('Error rendering component:', componentId, e);
      return this.renderError(componentId, e.message);
    }
  }

  /**
   * 获取绑定值
   */
  getBoundValue(boundValue) {
    if (!boundValue) return '';
    
    if (boundValue.literalString !== undefined) {
      return boundValue.literalString;
    }
    
    if (boundValue.path) {
      // 简化处理，直接返回默认值
      return boundValue.literalString || '';
    }
    
    return '';
  }

  /**
   * 渲染子元素
   */
  renderChildren(surfaceId, children) {
    if (!children) return [];
    
    const childIds = children.explicitList || [];
    return childIds
      .map(id => this.renderComponent(surfaceId, id))
      .filter(el => el !== null);
  }

  // 组件渲染方法

  renderText(props) {
    const el = document.createElement('div');
    el.className = 'a2ui-text';
    
    const text = this.getBoundValue(props.text);
    const usageHint = props.usageHint || 'body';
    
    const tagMap = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      caption: 'span',
      body: 'p'
    };
    
    const tag = tagMap[usageHint] || 'p';
    const textEl = document.createElement(tag);
    textEl.textContent = text;
    
    // 样式
    textEl.style.margin = '0.5rem 0';
    if (usageHint === 'h1') textEl.style.fontSize = '2rem';
    else if (usageHint === 'h2') textEl.style.fontSize = '1.5rem';
    else if (usageHint === 'h3') textEl.style.fontSize = '1.25rem';
    
    el.appendChild(textEl);
    return el;
  }

  renderButton(surfaceId, props) {
    const el = document.createElement('button');
    el.className = 'a2ui-button';
    
    el.style.cssText = `
      padding: 0.75rem 1.5rem;
      background: #1976D2;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      margin: 0.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `;
    
    // 处理 child
    if (props.child) {
      if (typeof props.child === 'string') {
        // child 是组件 ID
        const childEl = this.renderComponent(surfaceId, props.child);
        if (childEl) {
          // 提取文本内容
          const textContent = childEl.textContent || '';
          el.textContent = textContent;
        }
      }
    }
    
    if (props.action) {
      el.onclick = () => {
        console.log('Button action:', props.action.name);
        alert('Action: ' + props.action.name);
      };
    }
    
    return el;
  }

  renderColumn(surfaceId, props) {
    const el = document.createElement('div');
    el.className = 'a2ui-column';
    el.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `;
    
    const children = this.renderChildren(surfaceId, props.children);
    children.forEach(child => el.appendChild(child));
    
    return el;
  }

  renderRow(surfaceId, props) {
    const el = document.createElement('div');
    el.className = 'a2ui-row';
    el.style.cssText = `
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      align-items: center;
    `;
    
    const children = this.renderChildren(surfaceId, props.children);
    children.forEach(child => el.appendChild(child));
    
    return el;
  }

  renderCard(surfaceId, props) {
    const el = document.createElement('div');
    el.className = 'a2ui-card';
    el.style.cssText = `
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 1rem;
      margin: 0.5rem 0;
    `;
    
    if (props.child && typeof props.child === 'string') {
      const childEl = this.renderComponent(surfaceId, props.child);
      if (childEl) el.appendChild(childEl);
    }
    
    return el;
  }

  renderTextField(props) {
    const el = document.createElement('div');
    el.className = 'a2ui-textfield';
    
    const label = this.getBoundValue(props.label);
    const value = this.getBoundValue(props.text);
    
    if (label) {
      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      labelEl.style.cssText = 'display: block; margin-bottom: 0.25rem; font-weight: 500;';
      el.appendChild(labelEl);
    }
    
    const input = document.createElement('input');
    input.type = props.textFieldType || 'text';
    input.value = value;
    input.style.cssText = `
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    `;
    
    el.appendChild(input);
    return el;
  }

  renderDivider(props) {
    const el = document.createElement('hr');
    el.className = 'a2ui-divider';
    el.style.cssText = `
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 0.5rem 0;
    `;
    return el;
  }

  renderImage(props) {
    const el = document.createElement('img');
    el.className = 'a2ui-image';
    el.src = props.url || '';
    el.style.cssText = 'max-width: 100%; border-radius: 4px;';
    return el;
  }

  renderList(surfaceId, props) {
    const el = document.createElement('div');
    el.className = 'a2ui-list';
    el.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
    
    // 简化列表渲染
    return el;
  }

  renderCheckBox(props) {
    const el = document.createElement('label');
    el.className = 'a2ui-checkbox';
    el.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; cursor: pointer;';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = props.value || false;
    
    const label = this.getBoundValue(props.label);
    
    el.appendChild(input);
    el.appendChild(document.createTextNode(label));
    
    return el;
  }

  renderUnknown(type) {
    const el = document.createElement('div');
    el.className = 'a2ui-unknown';
    el.style.cssText = 'padding: 1rem; background: #fff3e0; border-radius: 4px; color: #e65100;';
    el.textContent = 'Unknown component: ' + type;
    return el;
  }

  renderError(componentId, message) {
    const el = document.createElement('div');
    el.className = 'a2ui-error';
    el.style.cssText = 'padding: 1rem; background: #ffebee; border-radius: 4px; color: #c62828;';
    el.textContent = 'Error in ' + componentId + ': ' + message;
    return el;
  }

  /**
   * 清空
   */
  clear() {
    this.surfaces = {};
    this.dataModels = {};
    this.container.innerHTML = '';
  }

  /**
   * 辅助方法：valueMap 转对象
   */
  valueMapToObject(valueMap) {
    if (!valueMap) return {};
    const obj = {};
    for (const item of valueMap) {
      obj[item.key] = item.valueString;
    }
    return obj;
  }
}

// 导出
window.A2UIRenderer = A2UIRenderer;