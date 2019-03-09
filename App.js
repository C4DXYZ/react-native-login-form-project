import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import { CheckBox } from 'react-native-elements';
import logo from './assets/logo.png';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      storedEmail: null,
      storedPassword: null,
      checked: false,
      disabledButton: true,
      isFocusedEmail: false,
      isFocusedPassword: false,
    }
  }
  // validating email format and checking if email is empty and displays error message.
  onEmailTextChanged = (email) => {

    if (email.trim() != 0) {

      this.setState({ email: email, isEmailValid: false, disabledButton: true, emailErrorStatus1: false, emailErrorStatus2: false });

      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var isValid = regex.test(email);

      if (isValid) {
        this.state.isPasswordValid ? this.setState({ disabledButton: false }) : this.setState({ disabledButton: true });
        this.setState({ isEmailValid: true });
      }
      else {
        this.setState({ email: email, emailErrorStatus1: false, emailErrorStatus2: true });
      }
    }
    else {
      this.setState({ email: email, emailErrorStatus1: true, emailErrorStatus2: false });
      this.setState({ isFocusedEmail: !this.state.isFocusedEmail });
    }
  }

  // validating password and checking if password is empty and displays error message.
  onPasswordTextChanged = (password) => {

    if (password.trim() != 0) {

      this.setState({ password: password, isPasswordValid: false, disabledButton: true, passwordErrorStatus1: false, passwordErrorStatus2: false });

      if (password.trim().length > 5) {
        // checks if both email and password are valid before enabling the login button.
        this.state.isEmailValid ? this.setState({ disabledButton: false }) : this.setState({ disabledButton: true });
        this.setState({ isPasswordValid: true });
      }
      else {
        //if user password is less than 6 characters it displays an error message.
        this.setState({ password: password, passwordErrorStatus1: false, passwordErrorStatus2: true });
      }
    }
    else {
      // displays error message if text input is empty.
      this.setState({ password: password, passwordErrorStatus1: true, passwordErrorStatus2: false });
      this.setState({ isFocusedPassword: !this.state.isFocusedPassword });
    }
  }

  // triggers when button is press, converts user's credentials to an object and save locally.
  onLoginPressed = async () => {
    // credentials are validated and checks if 'Remember me' checkbox was checked or no.
    if (this.state.isEmailValid && this.state.isPasswordValid && this.state.checked) {

      let obj = {
        username: this.state.email,
        password: this.state.password,
      }
      //  user credentials were saved as string using 'user' as key.
      AsyncStorage.setItem('user', JSON.stringify(obj));
      // clears the text input box.
      this.setState({ storedEmail: '', storedPassword: '' });
      // retrieving data using the 'user' key. Displays alert stating that login was successful and "Remember me" was checked.
      try {
        Alert.alert("Alert", "Login Success!");
        let user = await AsyncStorage.getItem('user');
        let parsed = JSON.parse(user);
        // displays user's credentials back to it's respective text input box.
        this.setState({ storedEmail: parsed.username, storedPassword: parsed.password })

      }
      catch (error) {
        Alert.alert("Alert", "There's an error!");
      }

    }
    // valid credentials and 'Remember me' checkbox unchecked will execute this part.
    else if (this.state.isEmailValid && this.state.isPasswordValid && !this.state.checked) {
      // clears the text input boxes and alert user that 'Remember me' checkbox was unchecked.
      this.setState({ storedEmail: '', storedPassword: '' });
      Alert.alert("Alert", "Login Success!");
      // AsyncStorage.removeItem('user');
    }
  }

  render() {

    const { storedEmail, storedPassword } = this.state;
    return (

      <View style={styles.container}>
        {/* displays the logo inside asset folder */}
        <TouchableOpacity style={styles.imageContainer}>
          <View key={this.state.reloadPage}>
            <Image source={logo} style={styles.logo}
              source={require('./assets/logo.png')}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.alignmentContainer}>
          {/* email text input box */}
          <Text style={styles.inputLabel}>Email</Text>
          <View style={[styles.inputContainer, styles.inputButtonCommon]}>
            {/* if text input box is focused uses normal font style else it uses the italic font style */}
            <TextInput style={this.state.isFocusedEmail ? styles.inputs : styles.inputPlaceholder}
              onFocus={() => this.setState({ isFocusedEmail: true })}
              placeholder="Input email address"
              keyboardType="email-address"
              value={this.state.storedEmail}
              // sends the email value to the function and perform operation everytime text is change.
              onChangeText={email => this.onEmailTextChanged(email)}
            />
          </View>
          {/* displays this error message if email error status 1 is true */}
          {
            this.state.emailErrorStatus1 == true ?
              (
                <Text style={styles.errorMessage}>
                  email cannot be empty
             </Text>
              ) : null
          }
          {/* displays this error message if email error status 2 is true */}
          {
            this.state.emailErrorStatus2 == true ?
              (
                <Text style={styles.errorMessage}>
                  not correct format for email address
             </Text>
              ) : null
          }
          {/* same goes here, those operations performed in email text input box */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.inputContainer, styles.inputButtonCommon]}>
            <TextInput style={this.state.isFocusedPassword ? styles.inputs : styles.inputPlaceholder}
              onFocus={() => this.setState({ isFocusedPassword: true })}
              placeholder="Input password"
              // displays circles instead of the actual characters
              secureTextEntry={true}
              value={this.state.storedPassword}
              onChangeText={password => this.onPasswordTextChanged(password)}
            />
          </View>

          {this.state.passwordErrorStatus1 == true ?
            (
              <Text style={styles.errorMessage}>
                password cannot be empty
             </Text>
            ) : null
          }

          {
            this.state.passwordErrorStatus2 == true ?
              (
                <Text style={styles.errorMessage}>
                  please use at least 6 - 12 characters
             </Text>
              ) : null
          }

          <CheckBox
            // checkbox styling goes here not on the  style sheet.
            containerStyle={{ backgroundColor: 'white', borderColor: 'white', alignSelf: 'flex-start', marginBottom: 40, marginLeft: 0, padding: 0 }}
            // uncheckedbox color when it's disabled.
            uncheckedColor={this.state.disabledButton ? '#d3d3d3' : '#aa8fdb'}
            // checkedbox color when it's enabled.
            checkedColor={'#aa8fdb'}
            title={<Text style={styles.checkboxTitle}>Remember me</Text>}
            // checkbox icon type.
            checkedIcon='check-square'
            // checks if button was pressed and changes the checkbox icon.
            checked={this.state.checked}
            onPress={() => this.setState({ checked: !this.state.checked })}
            // checkbox is disabled if user credentials were invalid.
            disabled={!this.state.isEmailValid || !this.state.isPasswordValid}
          />

          <TouchableOpacity
            // button styling when disabled and enabled
            style={[this.state.disabledButton ? styles.disabledButton : styles.button, styles.inputButtonCommon]}
            // executes the the function.
            onPress={this.onLoginPressed}
            // button opacity changes when button is enabled. 
            activeOpacity={this.state.disabledButton ? 1 : 0.8}
            // button is disabled if user credentials were invalid.
            disabled={!this.state.isEmailValid || !this.state.isPasswordValid}
          >
            <Text style={styles.loginText}> Sign In </Text>
          </TouchableOpacity>

        </View>

      </View>

    );
  }
}

// props styling
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    marginBottom: 50
  },
  // alignmentContainer: {
  // },
  inputButtonCommon: {
    width: 350,
    borderRadius: 5,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    // fontWeight: 'bold'
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#aa8fdb',
  },
  inputPlaceholder: {
    height: 45,
    marginLeft: 16,
    fontStyle: 'italic'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    fontStyle: 'normal'
  },
  errorMessage: {
    color: 'red',
    marginTop: -17,
    fontStyle: 'italic',
    fontSize: 12
  },
  checkboxTitle: {
    fontFamily: 'sans-serif'
  },
  button: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aa8fdb'
  },
  disabledButton: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold'
  },
});
