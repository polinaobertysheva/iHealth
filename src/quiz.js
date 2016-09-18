var Option = React.createClass({
  getInitialState: function(){
    return { };
  },

  checkUpdate: function(e){
    e.preventDefault();

    var isCreateNew = false;
    // check previos value of textOption
    if (this.props.textOption === "" && e.target.value !== ""){
      //send this function via props from parent component
      isCreateNew = true;
    }

    this.props.saveOption({
      id: this.props.id,
      textOption: e.target.value,
      isSelected: false
    }, isCreateNew);
  },

  render: function(){
    if(this.props.isValidate){
      if(this.props.textOption !== ""){
        return(
          <div className="option optionValidate">
            <input name={"option" + this.props.idQuestion} type="radio"/>
            <label className="label_TextOption">{this.props.textOption}</label>
          </div>
        );
      } else {
        return null;
      }
    } else {
      return(
        <div className="option optionModify">
           <input className="radio_option" name={"option" + this.props.idQuestion} type="radio"/>
            <input className="input_option" type="text" defaultValue={this.props.textOption} placeholder="Ajouter une option"
            onBlur={this.checkUpdate} />
        </div>
      );
    }
  }
});

var Question = React.createClass({
  getInitialState: function(){
    return {
      id: this.props.id,
      textQuestion: "",
      type: "radio",
      options: [
        {
          id: 0,
          textOption: "",
          isSelected: false
        }
      ]
    };
  },

  saveOption: function(option, isCreateNew){
    var options = this.state.options.slice();
    for(var i = 0; i < options.length; i++){
      if(options[i].id === option.id){
        options[i].textOption = option.textOption;
        options[i].isSelected = option.isSelected;

        if(isCreateNew){
          options.push({ id: this.state.options.length, textOption: "", isSelected: false});
        }

        this.setState({
          id: this.props.id,
          textQuestion: this.state.textQuestion,
          type: this.state.type,
          options: options
        });

        // break from loop
        return;
      }
    }
  },

  setTextQuestion: function(e){
    e.preventDefault();
    this.setState({
      id: this.props.id,
      textQuestion: e.target.value,
      type: this.state.type,
      options: this.state.options
    });
  },

  validateQuestion: function(e){
    e.preventDefault();
    this.setState({
      id: this.props.id,
      textQuestion: this.state.textQuestion,
      type: this.state.type,
      options: this.state.options
    });
  },

  changeQuestionType: function(e){
    this.setState({
      id: this.props.id,
      textQuestion: this.state.textQuestion,
      type: e.target.value,
      options: this.state.options
    });
  },

  render: function ()
  {
    var questionName, questionContent, questionType;
    //var buttonValidate;
    if(this.props.isValidate){

      questionName = <label className="label_TextQuestion">{this.state.textQuestion}</label>;

      questionType=""

    } else {

      questionName =  <input type="text"
                      className="input_question"
                      defaultValue={this.state.textQuestion}
                      placeholder="Votre question"
                      onBlur={this.setTextQuestion} />;

      questionType= <select type='text'
                    onChange={this.changeQuestionType}
                    value={this.state.type}>
                        <option value="radio">Choix multiple</option>
                        <option value="textArea">Reponse longue</option>
                    </select>

    }

    if(this.state.type === "radio"){
      questionContent = this.state.options.map(function(option, i){
          return(
          <Option key={i}
                  id={i}
                  textOption={option.textOption}
                  isSelected={option.isSelected}
                  isValidate = {this.props.isValidate}
                  idQuestion={this.props.id}
                  saveOption={this.saveOption} />
          );
      }.bind(this));
    } else {
      questionContent = <textarea/>
    }

    return(
    <div className="question">

      {questionName}
      {questionType}
      {questionContent}

    </div>
    );
  }
});

var Quiz = React.createClass({

  getInitialState: function(){
    return {
      name: "",
      isValidate: false,
      questions: [{
        id: 0
      }]
    };
  },

  addQuestion: function(){
    var questions=this.state.questions.slice();

    questions.push({id: this.state.questions.length});

    this.setState({
      name: this.state.name,
      isValidate: this.state.isValidate,
      questions:questions
    });
  },
  changeStatusQuiz: function ()
  {
    this.setState({
      name:this.state.name,
      isValidate:!this.state.isValidate,
      questions:this.state.questions
    })

  },

  saveQuizName: function(e){
    e.preventDefault();
    this.setState({
      name: e.target.value,
      isValidate:this.state.isValidate,
      questions:this.state.questions
    });
  },

  render: function ()
  {
    var btnValidate, btnAddQuestion, quizName;
    var questions= this.state.questions.map(function(question, i){
      return(
        <div className="question" key={i}> <Question id={question.id} isValidate={this.state.isValidate} /> </div>
      );
    }.bind(this));

    if(this.state.isValidate){

        btnValidate = <button className="cta cta1" onClick={this.changeStatusQuiz}>Modifier</button>
        btnAddQuestion = ""
        quizName= <label className="label_quiz">{this.state.name}</label>

    }else{

        btnValidate = <button className="cta cta1" onClick={this.changeStatusQuiz}>Valider</button>
        btnAddQuestion = <button id="addQuestion" className="cta cta1 " onClick={this.addQuestion}>+</button>
        quizName= <input type="text" placeholder="Votre questionnaire" className="input_quiz" onBlur={this.saveQuizName}/>

    }
    return(
      <section id="quiz">
        {quizName}
        {btnValidate}
        <div className="questions">
          {questions}
        </div>
        {btnAddQuestion}

      </section>

    );
  }
});

var Main = React.createClass({
  render: function ()
  {
    return(
      <div>
        <Quiz />
      </div>
    );
  }
});

ReactDOM.render(<Main />, document.getElementById("container"));
