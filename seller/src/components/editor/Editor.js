import React from 'react';
import ReactQuill from 'react-quill';
import './Editor.css';
import 'react-quill/dist/quill.snow.css';

class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.saveInterval = React.createRef();
    this.state = { editorHtml: '', theme: 'snow' }
    this.handleChange = this.handleChange.bind(this)
  }
  
  handleChange (html) {
    if (this.saveInterval.current) {
      clearTimeout(this.saveInterval.current)
    }
    this.saveInterval.current = setTimeout(() => {
      this.setState({ editorHtml: html });
      this.props.setProdDesc(this.state);
    }, 2000);
  }
  
  render () {
    return (
      <div>
        <ReactQuill 
          theme={this.state.theme}
          onChange={this.handleChange}
          value={this.state.editorHtml}
          modules={Editor.modules}
          formats={Editor.formats}
          bounds={'.app'}
          placeholder={this.props.placeholder}
          prodDesc = {this.props.prodDesc}
         />
       </div>
     )
  }
}

export default Editor;