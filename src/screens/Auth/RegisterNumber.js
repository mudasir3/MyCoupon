import React, { Component,createRef } from 'react';
import { StyleSheet, Text, View,TouchableOpacity ,TextInput,Image, 
Keyboard,Platform, ActivityIndicator,KeyboardAvoidingView,AppState,FlatList,StatusBar} from 'react-native';

import VirtualKeyboard from 'react-native-virtual-keyboard';
import { Icon, Row} from "native-base";
import SearchableDropdown from 'react-native-searchable-dropdown';
import countries from "./Countries";
import Spinner from 'react-native-loading-spinner-overlay';
import RNPicker from "rn-modal-picker";

import {registerUser} from "../API/ApiActions";
import LinearGradient from 'react-native-linear-gradient';

import Logo from '../../../assets/Logo.svg';
import BackButton from '../../../assets/backbtn.svg';

import DeviceInfo from 'react-native-device-info';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

var _this;

var num = ''
var items = [
  //name key is must.It is to show the text in front
  { id: 1, name: 'angellist' },
  { id: 2, name: 'codepen' },
  { id: 3, name: 'envelope' },
  { id: 4, name: 'etsy' },
  { id: 5, name: 'facebook' },
  { id: 6, name: 'foursquare' },
  { id: 7, name: 'github-alt' },
  { id: 8, name: 'github' },
  { id: 9, name: 'gitlab' },
  { id: 10, name: 'instagram' },
];

export default class RegisterNumberScreen extends Component {

    textInput = createRef();

    focusTextInput = () => this.textInput.focus();
    
    constructor(props) {
        super(props)

        AppState.addEventListener('change', newState => {
          console.log('new state', newState);
    
          this.setState({ show: false})

          setTimeout(function(){
            _this.setState({ show: true})
    
          }, 100);
         });


        let index = 0;
          this.phoneData = countries.map(country => {
            return {
              key: index++,
              label: `${country.flag} ${country.code} ${
                country.dial_code
              }`,
              ...country
            };
          }); 

          _this= this;

          this.state = {
            show: false,
            phon_num: '',
      dataSource: [
                    {
                    "name":"Afghanistan"+" "+ "🇦🇫",
                    "flag":"🇦🇫",
                    "code":"AF",
                    "dial_code":"+93"
                    },
                    {
                    "name":"Åland Islands"+" "+"🇦🇽",
                    "flag":"🇦🇽",
                    "code":"AX",
                    "dial_code":"+358"
                    },
                    {
                    "name":"Albania"+" "+"🇦🇱",
                    "flag":"🇦🇱",
                    "code":"AL",
                    "dial_code":"+355"
                    },
                    {
                    "name":"Algeria"+" "+"🇩🇿",
                    "flag":"🇩🇿",
                    "code":"DZ",
                    "dial_code":"+213"
                    },
                    {
                    "name":"American Samoa"+" "+"🇦🇸",
                    "flag":"🇦🇸",
                    "code":"AS",
                    "dial_code":"+1684"
                    },
                    {
                    "name":"Andorra"+" "+"🇦🇩",
                    "flag":"🇦🇩",
                    "code":"AD",
                    "dial_code":"+376"
                    },
                    {
                    "name":"Angola"+" "+"🇦🇴",
                    "flag":"🇦🇴",
                    "code":"AO",
                    "dial_code":"+244"
                    },
                    {
                    "name":"Anguilla"+" "+"🇦🇮",
                    "flag":"🇦🇮",
                    "code":"AI",
                    "dial_code":"+1264"
                    },
                    {
                    "name":"Antarctica"+" "+"🇦🇶",
                    "flag":"🇦🇶",
                    "code":"AQ",
                    "dial_code":"+672"
                    },
                    {
                    "name":"Antigua and Barbuda"+" "+"🇦🇬",
                    "flag":"🇦🇬",
                    "code":"AG",
                    "dial_code":"+1268"
                    },
                    {
                    "name":"Argentina"+" "+"🇦🇷",
                    "flag":"🇦🇷",
                    "code":"AR",
                    "dial_code":"+54"
                    },
                    {
                    "name":"Armenia"+" "+"🇦🇲",
                    "flag":"🇦🇲",
                    "code":"AM",
                    "dial_code":"+374"
                    },
                    {
                    "name":"Aruba"+" "+"🇦🇼",
                    "flag":"🇦🇼",
                    "code":"AW",
                    "dial_code":"+297"
                    },
                    {
                    "name":"Australia"+" "+"🇦🇺",
                    "flag":"🇦🇺",
                    "code":"AU",
                    "dial_code":"+61"
                    },
                    {
                    "name":"Austria"+" "+"🇦🇹",
                    "flag":"🇦🇹",
                    "code":"AT",
                    "dial_code":"+43"
                    },
                    {
                    "name":"Azerbaijan"+" "+"🇦🇿",
                    "flag":"🇦🇿",
                    "code":"AZ",
                    "dial_code":"+994"
                    },
                    {
                    "name":"Bahamas"+" "+"🇧🇸",
                    "flag":"🇧🇸",
                    "code":"BS",
                    "dial_code":"+1242"
                    },
                    {
                    "name":"Bahrain"+" "+"🇧🇭",
                    "flag":"🇧🇭",
                    "code":"BH",
                    "dial_code":"+973"
                    },
                    {
                    "name":"Bangladesh"+" "+"🇧🇩",
                    "flag":"🇧🇩",
                    "code":"BD",
                    "dial_code":"+880"
                    },
                    {
                    "name":"Barbados"+" "+"🇧🇧",
                    "flag":"🇧🇧",
                    "code":"BB",
                    "dial_code":"+1246"
                    },
                    {
                    "name":"Belarus"+" "+"🇧🇾",
                    "flag":"🇧🇾",
                    "code":"BY",
                    "dial_code":"+375"
                    },
                    {
                    "name":"Belgium"+" "+"🇧🇪",
                    "flag":"🇧🇪",
                    "code":"BE",
                    "dial_code":"+32"
                    },
                    {
                    "name":"Belize"+" "+"🇧🇿",
                    "flag":"🇧🇿",
                    "code":"BZ",
                    "dial_code":"+501"
                    },
                    {
                    "name":"Benin"+" "+"🇧🇯",
                    "flag":"🇧🇯",
                    "code":"BJ",
                    "dial_code":"+229"
                    },
                    {
                    "name":"Bermuda"+" "+"🇧🇲",
                    "flag":"🇧🇲",
                    "code":"BM",
                    "dial_code":"+1441"
                    },
                    {
                    "name":"Bhutan"+" "+"🇧🇹",
                    "flag":"🇧🇹",
                    "code":"BT",
                    "dial_code":"+975"
                    },
                    {
                    "name":"Bolivia, Plurinational State of bolivia"+" "+"🇧🇴",
                    "flag":"🇧🇴",
                    "code":"BO",
                    "dial_code":"+591"
                    },
                    {
                    "name":"Bosnia and Herzegovina"+" "+"🇧🇦",
                    "flag":"🇧🇦",
                    "code":"BA",
                    "dial_code":"+387"
                    },
                    {
                    "name":"Botswana"+" "+"🇧🇼",
                    "flag":"🇧🇼",
                    "code":"BW",
                    "dial_code":"+267"
                    },
                    {
                    "name":"Bouvet Island"+" "+"🇧🇻",
                    "flag":"🇧🇻",
                    "code":"BV",
                    "dial_code":"+47"
                    },
                    {
                    "name":"Brazil"+" "+"🇧🇷",
                    "flag":"🇧🇷",
                    "code":"BR",
                    "dial_code":"+55"
                    },
                    {
                    "name":"British Indian Ocean Territory"+" "+"🇮🇴",
                    "flag":"🇮🇴",
                    "code":"IO",
                    "dial_code":"+246"
                    },
                    {
                    "name":"Brunei Darussalam"+" "+"🇧🇳",
                    "flag":"🇧🇳",
                    "code":"BN",
                    "dial_code":"+673"
                    },
                    {
                    "name":"Bulgaria"+" "+"🇧🇬",
                    "flag":"🇧🇬",
                    "code":"BG",
                    "dial_code":"+359"
                    },
                    {
                    "name":"Burkina Faso"+" "+"🇧🇫",
                    "flag":"🇧🇫",
                    "code":"BF",
                    "dial_code":"+226"
                    },
                    {
                    "name":"Burundi"+" "+"🇧🇮",
                    "flag":"🇧🇮",
                    "code":"BI",
                    "dial_code":"+257"
                    },
                    {
                    "name":"Cambodia"+" "+"🇰🇭",
                    "flag":"🇰🇭",
                    "code":"KH",
                    "dial_code":"+855"
                    },
                    {
                    "name":"Cameroon"+" "+"🇨🇲",
                    "flag":"🇨🇲",
                    "code":"CM",
                    "dial_code":"+237"
                    },
                    {
                    "name":"Canada"+" "+"🇨🇦",
                    "flag":"🇨🇦",
                    "code":"CA",
                    "dial_code":"+1"
                    },
                    {
                    "name":"Cape Verde"+" "+"🇨🇻",
                    "flag":"🇨🇻",
                    "code":"CV",
                    "dial_code":"+238"
                    },
                    {
                    "name":"Cayman Islands"+" "+"🇰🇾",
                    "flag":"🇰🇾",
                    "code":"KY",
                    "dial_code":"+345"
                    },
                    {
                    "name":"Central African Republic"+" "+"🇨🇫",
                    "flag":"🇨🇫",
                    "code":"CF",
                    "dial_code":"+236"
                    },
                    {
                    "name":"Chad"+" "+"🇹🇩",
                    "flag":"🇹🇩",
                    "code":"TD",
                    "dial_code":"+235"
                    },
                    {
                    "name":"Chile"+" "+"🇨🇱",
                    "flag":"🇨🇱",
                    "code":"CL",
                    "dial_code":"+56"
                    },
                    {
                    "name":"China"+" "+"🇨🇳",
                    "flag":"🇨🇳",
                    "code":"CN",
                    "dial_code":"+86"
                    },
                    {
                    "name":"Christmas Island"+" "+"🇨🇽",
                    "flag":"🇨🇽",
                    "code":"CX",
                    "dial_code":"+61"
                    },
                    {
                    "name":"Cocos (Keeling) Islands"+" "+"🇨🇨",
                    "flag":"🇨🇨",
                    "code":"CC",
                    "dial_code":"+61"
                    },
                    {
                    "name":"Colombia"+" "+"🇨🇴",
                    "flag":"🇨🇴",
                    "code":"CO",
                    "dial_code":"+57"
                    },
                    {
                    "name":"Comoros"+" "+"🇰🇲",
                    "flag":"🇰🇲",
                    "code":"KM",
                    "dial_code":"+269"
                    },
                    {
                    "name":"Congo"+" "+"🇨🇬",
                    "flag":"🇨🇬",
                    "code":"CG",
                    "dial_code":"+242"
                    },
                    {
                    "name":"Congo, The Democratic Republic of the Congo"+" "+"🇨🇩",
                    "flag":"🇨🇩",
                    "code":"CD",
                    "dial_code":"+243"
                    },
                    {
                    "name":"Cook Islands"+" "+"🇨🇰",
                    "flag":"🇨🇰",
                    "code":"CK",
                    "dial_code":"+682"
                    },
                    {
                    "name":"Costa Rica"+" "+"🇨🇷",
                    "flag":"🇨🇷",
                    "code":"CR",
                    "dial_code":"+506"
                    },
                    {
                    "name":"Cote d'Ivoire"+" "+"🇨🇮",
                    "flag":"🇨🇮",
                    "code":"CI",
                    "dial_code":"+225"
                    },
                    {
                    "name":"Croatia"+" "+"🇭🇷",
                    "flag":"🇭🇷",
                    "code":"HR",
                    "dial_code":"+385"
                    },
                    {
                    "name":"Cuba"+" "+"🇨🇺",
                    "flag":"🇨🇺",
                    "code":"CU",
                    "dial_code":"+53"
                    },
                    {
                    "name":"Cyprus"+" "+"🇨🇾",
                    "flag":"🇨🇾",
                    "code":"CY",
                    "dial_code":"+357"
                    },
                    {
                    "name":"Czech Republic"+" "+"🇨🇿",
                    "flag":"🇨🇿",
                    "code":"CZ",
                    "dial_code":"+420"
                    },
                    {
                    "name":"Denmark"+" "+"🇩🇰",
                    "flag":"🇩🇰",
                    "code":"DK",
                    "dial_code":"+45"
                    },
                    {
                    "name":"Djibouti"+" "+"🇩🇯",
                    "flag":"🇩🇯",
                    "code":"DJ",
                    "dial_code":"+253"
                    },
                    {
                    "name":"Dominica"+" "+"🇩🇲",
                    "flag":"🇩🇲",
                    "code":"DM",
                    "dial_code":"+1767"
                    },
                    {
                    "name":"Dominican Republic"+" "+"🇩🇴",
                    "flag":"🇩🇴",
                    "code":"DO",
                    "dial_code":"+1849"
                    },
                    {
                    "name":"Ecuador"+" "+"🇪🇨",
                    "flag":"🇪🇨",
                    "code":"EC",
                    "dial_code":"+593"
                    },
                    {
                    "name":"Egypt"+" "+"🇪🇬",
                    "flag":"🇪🇬",
                    "code":"EG",
                    "dial_code":"+20"
                    },
                    {
                    "name":"El Salvador"+" "+"🇸🇻",
                    "flag":"🇸🇻",
                    "code":"SV",
                    "dial_code":"+503"
                    },
                    {
                    "name":"Equatorial Guinea"+" "+"🇬🇶",
                    "flag":"🇬🇶",
                    "code":"GQ",
                    "dial_code":"+240"
                    },
                    {
                    "name":"Eritrea"+" "+"🇪🇷",
                    "flag":"🇪🇷",
                    "code":"ER",
                    "dial_code":"+291"
                    },
                    {
                    "name":"Estonia"+" "+"🇪🇪",
                    "flag":"🇪🇪",
                    "code":"EE",
                    "dial_code":"+372"
                    },
                    {
                    "name":"Ethiopia"+" "+"🇪🇹",
                    "flag":"🇪🇹",
                    "code":"ET",
                    "dial_code":"+251"
                    },
                    {
                    "name":"Falkland Islands (Malvinas)"+" "+"🇫🇰",
                    "flag":"🇫🇰",
                    "code":"FK",
                    "dial_code":"+500"
                    },
                    {
                    "name":"Faroe Islands"+" "+"🇫🇴",
                    "flag":"🇫🇴",
                    "code":"FO",
                    "dial_code":"+298"
                    },
                    {
                    "name":"Fiji"+" "+"🇫🇯",
                    "flag":"🇫🇯",
                    "code":"FJ",
                    "dial_code":"+679"
                    },
                    {
                    "name":"Finland"+" "+"🇫🇮",
                    "flag":"🇫🇮",
                    "code":"FI",
                    "dial_code":"+358"
                    },
                    {
                    "name":"France"+" "+"🇫🇷",
                    "flag":"🇫🇷",
                    "code":"FR",
                    "dial_code":"+33"
                    },
                    {
                    "name":"French Guiana"+" "+"🇬🇫",
                    "flag":"🇬🇫",
                    "code":"GF",
                    "dial_code":"+594"
                    },
                    {
                    "name":"French Polynesia"+" "+"🇵🇫",
                    "flag":"🇵🇫",
                    "code":"PF",
                    "dial_code":"+689"
                    },
                    {
                    "name":"French Southern Territories"+" "+"🇹🇫",
                    "flag":"🇹🇫",
                    "code":"TF",
                    "dial_code":"+262"
                    },
                    {
                    "name":"Gabon"+" "+"🇬🇦",
                    "flag":"🇬🇦",
                    "code":"GA",
                    "dial_code":"+241"
                    },
                    {
                    "name":"Gambia"+" "+"🇬🇲",
                    "flag":"🇬🇲",
                    "code":"GM",
                    "dial_code":"+220"
                    },
                    {
                    "name":"Georgia"+" "+"🇬🇪",
                    "flag":"🇬🇪",
                    "code":"GE",
                    "dial_code":"+995"
                    },
                    {
                    "name":"Germany"+" "+"🇩🇪",
                    "flag":"🇩🇪",
                    "code":"DE",
                    "dial_code":"+49"
                    },
                    {
                    "name":"Ghana"+" "+"🇬🇭",
                    "flag":"🇬🇭",
                    "code":"GH",
                    "dial_code":"+233"
                    },
                    {
                    "name":"Gibraltar"+" "+"🇬🇮",
                    "flag":"🇬🇮",
                    "code":"GI",
                    "dial_code":"+350"
                    },
                    {
                    "name":"Greece"+" "+"🇬🇷",
                    "flag":"🇬🇷",
                    "code":"GR",
                    "dial_code":"+30"
                    },
                    {
                    "name":"Greenland"+" "+"🇬🇱",
                    "flag":"🇬🇱",
                    "code":"GL",
                    "dial_code":"+299"
                    },
                    {
                    "name":"Grenada"+" "+"🇬🇩",
                    "flag":"🇬🇩",
                    "code":"GD",
                    "dial_code":"+1473"
                    },
                    {
                    "name":"Guadeloupe"+" "+"🇬🇵",
                    "flag":"🇬🇵",
                    "code":"GP",
                    "dial_code":"+590"
                    },
                    {
                    "name":"Guam"+" "+"🇬🇺",
                    "flag":"🇬🇺",
                    "code":"GU",
                    "dial_code":"+1671"
                    },
                    {
                    "name":"Guatemala"+" "+"🇬🇹",
                    "flag":"🇬🇹",
                    "code":"GT",
                    "dial_code":"+502"
                    },
                    {
                    "name":"Guernsey"+" "+"🇬🇬",
                    "flag":"🇬🇬",
                    "code":"GG",
                    "dial_code":"+44"
                    },
                    {
                    "name":"Guinea"+" "+"🇬🇳",
                    "flag":"🇬🇳",
                    "code":"GN",
                    "dial_code":"+224"
                    },
                    {
                    "name":"Guinea-Bissau"+" "+"🇬🇼",
                    "flag":"🇬🇼",
                    "code":"GW",
                    "dial_code":"+245"
                    },
                    {
                    "name":"Guyana"+" "+"🇬🇾",
                    "flag":"🇬🇾",
                    "code":"GY",
                    "dial_code":"+592"
                    },
                    {
                    "name":"Haiti"+" "+"🇭🇹",
                    "flag":"🇭🇹",
                    "code":"HT",
                    "dial_code":"+509"
                    },
                    {
                    "name":"Heard Island and Mcdonald Islands"+" "+"🇭🇲",
                    "flag":"🇭🇲",
                    "code":"HM",
                    "dial_code":"+672"
                    },
                    {
                    "name":"Holy See (Vatican City State)"+" "+"🇻🇦",
                    "flag":"🇻🇦",
                    "code":"VA",
                    "dial_code":"+379"
                    },
                    {
                    "name":"Honduras"+" "+"🇭🇳",
                    "flag":"🇭🇳",
                    "code":"HN",
                    "dial_code":"+504"
                    },
                    {
                    "name":"Hong Kong"+" "+"🇭🇰",
                    "flag":"🇭🇰",
                    "code":"HK",
                    "dial_code":"+852"
                    },
                    {
                    "name":"Hungary"+" "+"🇭🇺",
                    "flag":"🇭🇺",
                    "code":"HU",
                    "dial_code":"+36"
                    },
                    {
                    "name":"Iceland"+" "+"🇮🇸",
                    "flag":"🇮🇸",
                    "code":"IS",
                    "dial_code":"+354"
                    },
                    {
                    "name":"India"+" "+"🇮🇳",
                    "flag":"🇮🇳",
                    "code":"IN",
                    "dial_code":"+91"
                    },
                    {
                    "name":"Indonesia"+" "+"🇮🇩",
                    "flag":"🇮🇩",
                    "code":"ID",
                    "dial_code":"+62"
                    },
                    {
                    "name":"Iran, Islamic Republic of Persian Gulf"+" "+"🇮🇷",
                    "flag":"🇮🇷",
                    "code":"IR",
                    "dial_code":"+98"
                    },
                    {
                    "name":"Iraq"+" "+"🇮🇶",
                    "flag":"🇮🇶",
                    "code":"IQ",
                    "dial_code":"+964"
                    },
                    {
                    "name":"Ireland"+" "+"🇮🇪",
                    "flag":"🇮🇪",
                    "code":"IE",
                    "dial_code":"+353"
                    },
                    {
                    "name":"Isle of Man"+" "+"🇮🇲",
                    "flag":"🇮🇲",
                    "code":"IM",
                    "dial_code":"+44"
                    },
                    {
                    "name":"Israel"+" "+"🇮🇱",
                    "flag":"🇮🇱",
                    "code":"IL",
                    "dial_code":"+972"
                    },
                    {
                    "name":"Italy"+" "+"🇮🇹",
                    "flag":"🇮🇹",
                    "code":"IT",
                    "dial_code":"+39"
                    },
                    {
                    "name":"Jamaica"+" "+"🇯🇲",
                    "flag":"🇯🇲",
                    "code":"JM",
                    "dial_code":"+1876"
                    },
                    {
                    "name":"Japan"+" "+"🇯🇵",
                    "flag":"🇯🇵",
                    "code":"JP",
                    "dial_code":"+81"
                    },
                    {
                    "name":"Jersey"+" "+"🇯🇪",
                    "flag":"🇯🇪",
                    "code":"JE",
                    "dial_code":"+44"
                    },
                    {
                    "name":"Jordan"+" "+"🇯🇴",
                    "flag":"🇯🇴",
                    "code":"JO",
                    "dial_code":"+962"
                    },
                    {
                    "name":"Kazakhstan"+" "+"🇰🇿",
                    "flag":"🇰🇿",
                    "code":"KZ",
                    "dial_code":"+7"
                    },
                    {
                    "name":"Kenya"+" "+"🇰🇪",
                    "flag":"🇰🇪",
                    "code":"KE",
                    "dial_code":"+254"
                    },
                    {
                    "name":"Kiribati"+" "+"🇰🇮",
                    "flag":"🇰🇮",
                    "code":"KI",
                    "dial_code":"+686"
                    },
                    {
                    "name":"Korea, Democratic People's Republic of Korea"+" "+"🇰🇵",
                    "flag":"🇰🇵",
                    "code":"KP",
                    "dial_code":"+850"
                    },
                    {
                    "name":"Korea, Republic of South Korea"+" "+"🇰🇷",
                    "flag":"🇰🇷",
                    "code":"KR",
                    "dial_code":"+82"
                    },
                    {
                    "name":"Kosovo"+" "+"🇽🇰",
                    "flag":"🇽🇰",
                    "code":"XK",
                    "dial_code":"+383"
                    },
                    {
                    "name":"Kuwait"+" "+"🇰🇼",
                    "flag":"🇰🇼",
                    "code":"KW",
                    "dial_code":"+965"
                    },
                    {
                    "name":"Kyrgyzstan"+" "+"🇰🇬",
                    "flag":"🇰🇬",
                    "code":"KG",
                    "dial_code":"+996"
                    },
                    {
                    "name":"Laos"+" "+"🇱🇦",
                    "flag":"🇱🇦",
                    "code":"LA",
                    "dial_code":"+856"
                    },
                    {
                    "name":"Latvia"+" "+"🇱🇻",
                    "flag":"🇱🇻",
                    "code":"LV",
                    "dial_code":"+371"
                    },
                    {
                    "name":"Lebanon"+" "+"🇱🇧",
                    "flag":"🇱🇧",
                    "code":"LB",
                    "dial_code":"+961"
                    },
                    {
                    "name":"Lesotho"+" "+"🇱🇸",
                    "flag":"🇱🇸",
                    "code":"LS",
                    "dial_code":"+266"
                    },
                    {
                    "name":"Liberia"+" "+"🇱🇷",
                    "flag":"🇱🇷",
                    "code":"LR",
                    "dial_code":"+231"
                    },
                    {
                    "name":"Libyan Arab Jamahiriya"+" "+"🇱🇾",
                    "flag":"🇱🇾",
                    "code":"LY",
                    "dial_code":"+218"
                    },
                    {
                    "name":"Liechtenstein"+" "+"🇱🇮",
                    "flag":"🇱🇮",
                    "code":"LI",
                    "dial_code":"+423"
                    },
                    {
                    "name":"Lithuania"+" "+"🇱🇹",
                    "flag":"🇱🇹",
                    "code":"LT",
                    "dial_code":"+370"
                    },
                    {
                    "name":"Luxembourg"+" "+"🇱🇺",
                    "flag":"🇱🇺",
                    "code":"LU",
                    "dial_code":"+352"
                    },
                    {
                    "name":"Macao"+" "+"🇲🇴",
                    "flag":"🇲🇴",
                    "code":"MO",
                    "dial_code":"+853"
                    },
                    {
                    "name":"Macedonia"+" "+"🇲🇰",
                    "flag":"🇲🇰",
                    "code":"MK",
                    "dial_code":"+389"
                    },
                    {
                    "name":"Madagascar"+" "+"🇲🇬",
                    "flag":"🇲🇬",
                    "code":"MG",
                    "dial_code":"+261"
                    },
                    {
                    "name":"Malawi"+" "+"🇲🇼",
                    "flag":"🇲🇼",
                    "code":"MW",
                    "dial_code":"+265"
                    },
                    {
                    "name":"Malaysia"+" "+"🇲🇾",
                    "flag":"🇲🇾",
                    "code":"MY",
                    "dial_code":"+60"
                    },
                    {
                    "name":"Maldives"+" "+"🇲🇻",
                    "flag":"🇲🇻",
                    "code":"MV",
                    "dial_code":"+960"
                    },
                    {
                    "name":"Mali"+" "+"🇲🇱",
                    "flag":"🇲🇱",
                    "code":"ML",
                    "dial_code":"+223"
                    },
                    {
                    "name":"Malta"+" "+"🇲🇹",
                    "flag":"🇲🇹",
                    "code":"MT",
                    "dial_code":"+356"
                    },
                    {
                    "name":"Marshall Islands"+" "+"🇲🇭",
                    "flag":"🇲🇭",
                    "code":"MH",
                    "dial_code":"+692"
                    },
                    {
                    "name":"Martinique"+" "+"🇲🇶",
                    "flag":"🇲🇶",
                    "code":"MQ",
                    "dial_code":"+596"
                    },
                    {
                    "name":"Mauritania"+" "+"🇲🇷",
                    "flag":"🇲🇷",
                    "code":"MR",
                    "dial_code":"+222"
                    },
                    {
                    "name":"Mauritius"+" "+"🇲🇺",
                    "flag":"🇲🇺",
                    "code":"MU",
                    "dial_code":"+230"
                    },
                    {
                    "name":"Mayotte"+" "+"🇾🇹",
                    "flag":"🇾🇹",
                    "code":"YT",
                    "dial_code":"+262"
                    },
                    {
                    "name":"Mexico"+" "+"🇲🇽",
                    "flag":"🇲🇽",
                    "code":"MX",
                    "dial_code":"+52"
                    },
                    {
                    "name":"Micronesia, Federated States of Micronesia"+" "+"🇫🇲",
                    "flag":"🇫🇲",
                    "code":"FM",
                    "dial_code":"+691"
                    },
                    {
                    "name":"Moldova"+" "+"🇲🇩",
                    "flag":"🇲🇩",
                    "code":"MD",
                    "dial_code":"+373"
                    },
                    {
                    "name":"Monaco"+" "+"🇲🇨",
                    "flag":"🇲🇨",
                    "code":"MC",
                    "dial_code":"+377"
                    },
                    {
                    "name":"Mongolia"+" "+"🇲🇳",
                    "flag":"🇲🇳",
                    "code":"MN",
                    "dial_code":"+976"
                    },
                    {
                    "name":"Montenegro"+" "+"🇲🇪",
                    "flag":"🇲🇪",
                    "code":"ME",
                    "dial_code":"+382"
                    },
                    {
                    "name":"Montserrat"+" "+"🇲🇸",
                    "flag":"🇲🇸",
                    "code":"MS",
                    "dial_code":"+1664"
                    },
                    {
                    "name":"Morocco"+" "+"🇲🇦",
                    "flag":"🇲🇦",
                    "code":"MA",
                    "dial_code":"+212"
                    },
                    {
                    "name":"Mozambique"+" "+"🇲🇿",
                    "flag":"🇲🇿",
                    "code":"MZ",
                    "dial_code":"+258"
                    },
                    {
                    "name":"Myanmar"+" "+"🇲🇲",
                    "flag":"🇲🇲",
                    "code":"MM",
                    "dial_code":"+95"
                    },
                    {
                    "name":"Namibia"+" "+"🇳🇦",
                    "flag":"🇳🇦",
                    "code":"NA",
                    "dial_code":"+264"
                    },
                    {
                    "name":"Nauru"+" "+"🇳🇷",
                    "flag":"🇳🇷",
                    "code":"NR",
                    "dial_code":"+674"
                    },
                    {
                    "name":"Nepal"+" "+"🇳🇵",
                    "flag":"🇳🇵",
                    "code":"NP",
                    "dial_code":"+977"
                    },
                    {
                    "name":"Netherlands"+" "+"🇳🇱",
                    "flag":"🇳🇱",
                    "code":"NL",
                    "dial_code":"+31"
                    },
                    {
                    "name":"Netherlands Antilles"+" "+"🇳🇷",
                    "flag":"🇳🇷",
                    "code":"AN",
                    "dial_code":"+599"
                    },
                    {
                    "name":"New Caledonia"+" "+"🇳🇨",
                    "flag":"🇳🇨",
                    "code":"NC",
                    "dial_code":"+687"
                    },
                    {
                    "name":"New Zealand"+" "+"🇳🇿",
                    "flag":"🇳🇿",
                    "code":"NZ",
                    "dial_code":"+64"
                    },
                    {
                    "name":"Nicaragua"+" "+"🇳🇮",
                    "flag":"🇳🇮",
                    "code":"NI",
                    "dial_code":"+505"
                    },
                    {
                    "name":"Niger"+" "+"🇳🇪",
                    "flag":"🇳🇪",
                    "code":"NE",
                    "dial_code":"+227"
                    },
                    {
                    "name":"Nigeria"+" "+"🇳🇬",
                    "flag":"🇳🇬",
                    "code":"NG",
                    "dial_code":"+234"
                    },
                    {
                    "name":"Niue"+" "+"🇳🇺",
                    "flag":"🇳🇺",
                    "code":"NU",
                    "dial_code":"+683"
                    },
                    {
                    "name":"Norfolk Island"+" "+"🇳🇫",
                    "flag":"🇳🇫",
                    "code":"NF",
                    "dial_code":"+672"
                    },
                    {
                    "name":"Northern Mariana Islands"+" "+"🇲🇵",
                    "flag":"🇲🇵",
                    "code":"MP",
                    "dial_code":"+1670"
                    },
                    {
                    "name":"Norway"+" "+"🇳🇴",
                    "flag":"🇳🇴",
                    "code":"NO",
                    "dial_code":"+47"
                    },
                    {
                    "name":"Oman"+" "+"🇴🇲",
                    "flag":"🇴🇲",
                    "code":"OM",
                    "dial_code":"+968"
                    },
                    {
                    "name":"Pakistan"+" "+"🇵🇰",
                    "flag":"🇵🇰",
                    "code":"PK",
                    "dial_code":"+92"
                    },
                    {
                    "name":"Palau"+" "+"🇵🇼",
                    "flag":"🇵🇼",
                    "code":"PW",
                    "dial_code":"+680"
                    },
                    {
                    "name":"Palestinian Territory, Occupied"+" "+"🇵🇸",
                    "flag":"🇵🇸",
                    "code":"PS",
                    "dial_code":"+970"
                    },
                    {
                    "name":"Panama"+" "+"🇵🇦",
                    "flag":"🇵🇦",
                    "code":"PA",
                    "dial_code":"+507"
                    },
                    {
                    "name":"Papua New Guinea"+" "+"🇵🇬",
                    "flag":"🇵🇬",
                    "code":"PG",
                    "dial_code":"+675"
                    },
                    {
                    "name":"Paraguay"+" "+"🇵🇾",
                    "flag":"🇵🇾",
                    "code":"PY",
                    "dial_code":"+595"
                    },
                    {
                    "name":"Peru"+" "+"🇵🇪",
                    "flag":"🇵🇪",
                    "code":"PE",
                    "dial_code":"+51"
                    },
                    {
                    "name":"Philippines"+" "+"🇵🇭",
                    "flag":"🇵🇭",
                    "code":"PH",
                    "dial_code":"+63"
                    },
                    {
                    "name":"Pitcairn"+" "+"🇵🇳",
                    "flag":"🇵🇳",
                    "code":"PN",
                    "dial_code":"+64"
                    },
                    {
                    "name":"Poland"+" "+"🇵🇱",
                    "flag":"🇵🇱",
                    "code":"PL",
                    "dial_code":"+48"
                    },
                    {
                    "name":"Portugal"+" "+"🇵🇹",
                    "flag":"🇵🇹",
                    "code":"PT",
                    "dial_code":"+351"
                    },
                    {
                    "name":"Puerto Rico"+" "+"🇵🇷",
                    "flag":"🇵🇷",
                    "code":"PR",
                    "dial_code":"+1939"
                    },
                    {
                    "name":"Qatar"+" "+"🇶🇦",
                    "flag":"🇶🇦",
                    "code":"QA",
                    "dial_code":"+974"
                    },
                    {
                    "name":"Romania"+" "+"🇷🇴",
                    "flag":"🇷🇴",
                    "code":"RO",
                    "dial_code":"+40"
                    },
                    {
                    "name":"Russia"+" "+"🇷🇺",
                    "flag":"🇷🇺",
                    "code":"RU",
                    "dial_code":"+7"
                    },
                    {
                    "name":"Rwanda"+" "+"🇷🇼",
                    "flag":"🇷🇼",
                    "code":"RW",
                    "dial_code":"+250"
                    },
                    {
                    "name":"Reunion"+" "+"🇷🇪",
                    "flag":"🇷🇪",
                    "code":"RE",
                    "dial_code":"+262"
                    },
                    {
                    "name":"Saint Barthelemy"+" "+"🇧🇱",
                    "flag":"🇧🇱",
                    "code":"BL",
                    "dial_code":"+590"
                    },
                    {
                    "name":"Saint Helena, Ascension and Tristan Da Cunha"+" "+"🇸🇭",
                    "flag":"🇸🇭",
                    "code":"SH",
                    "dial_code":"+290"
                    },
                    {
                    "name":"Saint Kitts and Nevis"+" "+"🇰🇳",
                    "flag":"🇰🇳",
                    "code":"KN",
                    "dial_code":"+1869"
                    },
                    {
                    "name":"Saint Lucia"+" "+"🇱🇨",
                    "flag":"🇱🇨",
                    "code":"LC",
                    "dial_code":"+1758"
                    },
                    {
                    "name":"Saint Martin"+" "+"🇲🇫",
                    "flag":"🇲🇫",
                    "code":"MF",
                    "dial_code":"+590"
                    },
                    {
                    "name":"Saint Pierre and Miquelon"+" "+"🇵🇲",
                    "flag":"🇵🇲",
                    "code":"PM",
                    "dial_code":"+508"
                    },
                    {
                    "name":"Saint Vincent and the Grenadines"+" "+"🇻🇨",
                    "flag":"🇻🇨",
                    "code":"VC",
                    "dial_code":"+1784"
                    },
                    {
                    "name":"Samoa"+" "+"🇼🇸",
                    "flag":"🇼🇸",
                    "code":"WS",
                    "dial_code":"+685"
                    },
                    {
                    "name":"San Marino"+" "+"🇸🇲",
                    "flag":"🇸🇲",
                    "code":"SM",
                    "dial_code":"+378"
                    },
                    {
                    "name":"Sao Tome and Principe"+" "+"🇸🇹",
                    "flag":"🇸🇹",
                    "code":"ST",
                    "dial_code":"+239"
                    },
                    {
                    "name":"Saudi Arabia"+" "+"🇸🇦",
                    "flag":"🇸🇦",
                    "code":"SA",
                    "dial_code":"+966"
                    },
                    {
                    "name":"Senegal"+" "+"🇸🇳",
                    "flag":"🇸🇳",
                    "code":"SN",
                    "dial_code":"+221"
                    },
                    {
                    "name":"Serbia"+" "+"🇷🇸",
                    "flag":"🇷🇸",
                    "code":"RS",
                    "dial_code":"+381"
                    },
                    {
                    "name":"Seychelles"+" "+"🇸🇨",
                    "flag":"🇸🇨",
                    "code":"SC",
                    "dial_code":"+248"
                    },
                    {
                    "name":"Sierra Leone"+" "+"🇸🇱",
                    "flag":"🇸🇱",
                    "code":"SL",
                    "dial_code":"+232"
                    },
                    {
                    "name":"Singapore"+" "+"🇸🇬",
                    "flag":"🇸🇬",
                    "code":"SG",
                    "dial_code":"+65"
                    },
                    {
                    "name":"Slovakia"+" "+"🇸🇰",
                    "flag":"🇸🇰",
                    "code":"SK",
                    "dial_code":"+421"
                    },
                    {
                    "name":"Slovenia"+" "+"🇸🇮",
                    "flag":"🇸🇮",
                    "code":"SI",
                    "dial_code":"+386"
                    },
                    {
                    "name":"Solomon Islands"+" "+"🇸🇧",
                    "flag":"🇸🇧",
                    "code":"SB",
                    "dial_code":"+677"
                    },
                    {
                    "name":"Somalia"+" "+"🇸🇴",
                    "flag":"🇸🇴",
                    "code":"SO",
                    "dial_code":"+252"
                    },
                    {
                    "name":"South Africa"+" "+"🇿🇦",
                    "flag":"🇿🇦",
                    "code":"ZA",
                    "dial_code":"+27"
                    },
                    {
                    "name":"South Sudan"+" "+"🇸🇸",
                    "flag":"🇸🇸",
                    "code":"SS",
                    "dial_code":"+211"
                    },
                    {
                    "name":"South Georgia and the South Sandwich Islands"+" "+"🇬🇸",
                    "flag":"🇬🇸",
                    "code":"GS",
                    "dial_code":"+500"
                    },
                    {
                    "name":"Spain"+" "+"🇪🇸",
                    "flag":"🇪🇸",
                    "code":"ES",
                    "dial_code":"+34"
                    },
                    {
                    "name":"Sri Lanka"+" "+"🇱🇰",
                    "flag":"🇱🇰",
                    "code":"LK",
                    "dial_code":"+94"
                    },
                    {
                    "name":"Sudan"+" "+"🇸🇩",
                    "flag":"🇸🇩",
                    "code":"SD",
                    "dial_code":"+249"
                    },
                    {
                    "name":"Suriname"+" "+"🇸🇷",
                    "flag":"🇸🇷",
                    "code":"SR",
                    "dial_code":"+597"
                    },
                    {
                    "name":"Svalbard and Jan Mayen"+" "+"🇸🇯",
                    "flag":"🇸🇯",
                    "code":"SJ",
                    "dial_code":"+47"
                    },
                    {
                    "name":"Swaziland"+" "+"🇸🇿",
                    "flag":"🇸🇿",
                    "code":"SZ",
                    "dial_code":"+268"
                    },
                    {
                    "name":"Sweden"+" "+"🇸🇪",
                    "flag":"🇸🇪",
                    "code":"SE",
                    "dial_code":"+46"
                    },
                    {
                    "name":"Switzerland"+" "+"🇨🇭",
                    "flag":"🇨🇭",
                    "code":"CH",
                    "dial_code":"+41"
                    },
                    {
                    "name":"Syrian Arab Republic"+" "+"🇸🇾",
                    "flag":"🇸🇾",
                    "code":"SY",
                    "dial_code":"+963"
                    },
                    {
                    "name":"Taiwan"+" "+"🇹🇼",
                    "flag":"🇹🇼",
                    "code":"TW",
                    "dial_code":"+886"
                    },
                    {
                    "name":"Tajikistan"+" "+"🇹🇯",
                    "flag":"🇹🇯",
                    "code":"TJ",
                    "dial_code":"+992"
                    },
                    {
                    "name":"Tanzania, United Republic of Tanzania"+" "+"🇹🇿",
                    "flag":"🇹🇿",
                    "code":"TZ",
                    "dial_code":"+255"
                    },
                    {
                    "name":"Thailand"+" "+"🇹🇭",
                    "flag":"🇹🇭",
                    "code":"TH",
                    "dial_code":"+66"
                    },
                    {
                    "name":"Timor-Leste"+" "+"🇹🇱",
                    "flag":"🇹🇱",
                    "code":"TL",
                    "dial_code":"+670"
                    },
                    {
                    "name":"Togo"+" "+"🇹🇬",
                    "flag":"🇹🇬",
                    "code":"TG",
                    "dial_code":"+228"
                    },
                    {
                    "name":"Tokelau"+" "+"🇹🇰",
                    "flag":"🇹🇰",
                    "code":"TK",
                    "dial_code":"+690"
                    },
                    {
                    "name":"Tonga"+" "+"🇹🇴",
                    "flag":"🇹🇴",
                    "code":"TO",
                    "dial_code":"+676"
                    },
                    {
                    "name":"Trinidad and Tobago"+" "+"🇹🇹",
                    "flag":"🇹🇹",
                    "code":"TT",
                    "dial_code":"+1868"
                    },
                    {
                    "name":"Tunisia"+" "+"🇹🇳",
                    "flag":"🇹🇳",
                    "code":"TN",
                    "dial_code":"+216"
                    },
                    {
                    "name":"Turkey"+" "+"🇹🇷",
                    "flag":"🇹🇷",
                    "code":"TR",
                    "dial_code":"+90"
                    },
                    {
                    "name":"Turkmenistan"+" "+"🇹🇲",
                    "flag":"🇹🇲",
                    "code":"TM",
                    "dial_code":"+993"
                    },
                    {
                    "name":"Turks and Caicos Islands"+" "+"🇹🇨",
                    "flag":"🇹🇨",
                    "code":"TC",
                    "dial_code":"+1649"
                    },
                    {
                    "name":"Tuvalu"+" "+"🇹🇻",
                    "flag":"🇹🇻",
                    "code":"TV",
                    "dial_code":"+688"
                    },
                    {
                    "name":"Uganda"+" "+"🇺🇬",
                    "flag":"🇺🇬",
                    "code":"UG",
                    "dial_code":"+256"
                    },
                    {
                    "name":"Ukraine"+" "+"🇺🇦",
                    "flag":"🇺🇦",
                    "code":"UA",
                    "dial_code":"+380"
                    },
                    {
                    "name":"United Arab Emirates"+" "+"🇦🇪",
                    "flag":"🇦🇪",
                    "code":"AE",
                    "dial_code":"+971"
                    },
                    {
                    "name":"United Kingdom"+" "+"🇬🇧",
                    "flag":"🇬🇧",
                    "code":"GB",
                    "dial_code":"+44"
                    },
                    {
                    "name":"United States"+" "+"🇺🇸",
                    "flag":"🇺🇸",
                    "code":"US",
                    "dial_code":"+1"
                    },
                    {
                    "name":"Uruguay"+" "+"🇺🇾",
                    "flag":"🇺🇾",
                    "code":"UY",
                    "dial_code":"+598"
                    },
                    {
                    "name":"Uzbekistan"+" "+"🇺🇿",
                    "flag":"🇺🇿",
                    "code":"UZ",
                    "dial_code":"+998"
                    },
                    {
                    "name":"Vanuatu"+" "+"🇻🇺",
                    "flag":"🇻🇺",
                    "code":"VU",
                    "dial_code":"+678"
                    },
                    {
                    "name":"Venezuela, Bolivarian Republic of Venezuela"+" "+"🇻🇪",
                    "flag":"🇻🇪",
                    "code":"VE",
                    "dial_code":"+58"
                    },
                    {
                    "name":"Vietnam"+" "+"🇻🇳",
                    "flag":"🇻🇳",
                    "code":"VN",
                    "dial_code":"+84"
                    },
                    {
                    "name":"Virgin Islands, British"+" "+"🇻🇬",
                    "flag":"🇻🇬",
                    "code":"VG",
                    "dial_code":"+1284"
                    },
                    {
                    "name":"Virgin Islands, U.S."+" "+"🇻🇮",
                    "flag":"🇻🇮",
                    "code":"VI",
                    "dial_code":"+1340"
                    },
                    {
                    "name":"Wallis and Futuna"+" "+"🇼🇫",
                    "flag":"🇼🇫",
                    "code":"WF",
                    "dial_code":"+681"
                    },
                    {
                    "name":"Yemen"+" "+"🇾🇪",
                    "flag":"🇾🇪",
                    "code":"YE",
                    "dial_code":"+967"
                    },
                    {
                    "name":"Zambia"+" "+"🇿🇲",
                    "flag":"🇿🇲",
                    "code":"ZM",
                    "dial_code":"+260"
                    },
                    {
                    "name":"Zimbabwe"+" "+"🇿🇼",
                    "flag":"🇿🇼",
                    "code":"ZW",
                    "dial_code":"+263"
                    }
      ],
      keyboardheight:0,
      placeHolderText: "+91",
      selectedText: "🇦🇫",
      text: '',
      number : '',
      fromlogin:false,
      forgot  : true,
      loading: false,
      phone: "",
      showProgress: false,
      codd: "+93",
      buttonVisible:false,
      
      phoneLocale : { 
          "name":"United States",
          "flag":"🇺🇸",
          "code":"US",
          "dial_code":"+1"
      }, 
      notch:false
    }
    }

    visible = visible => () => this.setState({visible});

    _keyboardDidShow(e) {

      _this.setState({
        keyboardheight:e.endCoordinates.height
      })
      console.log("keyboard height " + e.endCoordinates.height)

     // _this.visible(false)
  }

  _keyboardDidHide(e) {

    _this.setState({
      keyboardheight:e.endCoordinates.height
    })
    console.log("keyboard height " + e.endCoordinates.height)

   // _this.visible(true)
}

    componentDidMount()
    {

      let hasNotch = DeviceInfo.hasNotch();
      console.log("NOTCHH " + hasNotch)

      //this.visible(false)
    //  if (Platform.OS === "android") {
      this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow );
      this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
   // }

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

      var code =this.props.navigation.getParam('postInfo')
      var login =this.props.navigation.getParam('fromlogin')
      if(login==true)
      {
        this.setState({
          fromlogin:true
        })
      }
      else
      {
        this.setState({
          fromlogin:false
        })
      }

      console.log("codeeeee " + JSON.stringify(code) )
      if(code != undefined ){
        this._selectedValue(1,code)
      }
      
      this.setState({
        forgot : this.props.navigation.getParam("forgot")
      })


      this.setState({ show: false})

      setTimeout(function(){
        _this.setState({ show: true})

      }, 100);


    })


     

    }



    componentWillUnmount = () => {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  
    RegisterNumber = () =>{

      console.log("Registerrr ")

      this.setState({ loading: true,buttonVisible:false });
      
      // if (Platform.OS === "ios") {

      //   this.props.navigation.navigate('OTP')
      // }
      // else{
        
    if(this.state.number != '')
    {
     var mobile_number = this.state.codd + this.state.number
     const params = {mobile_number};

     console.log("params " + params)

     registerUser(params)
      .then(res => {
       console.log("res " + JSON.stringify(res))

          if(res.data.status == "success")
          {
            this.setState({ loading: false });

            if(this.state.forgot == true)
            {

            this.props.navigation.navigate('OTP' ,{"userid" :res.data.data[0].user.id,"number":mobile_number ,"forgot" : true})

            }else
            {
              this.props.navigation.navigate('OTP' ,{"userid" :res.data.data[0].user.id,"number":mobile_number })

            }
          }
          else{
            this.setState({ loading: false,buttonVisible:true });
            alert(res.data.message)
          }
        })
        .catch(e => {
          this.setState({ loading: false,buttonVisible:true });
          console.log("error", e);
          alert(e)
        });
      }
      else
      {
        this.setState({ loading: false });
        alert("Number empty")
      }
   
    } 

    changeText(newText) { 
     // console.log("on change text" + newText.length)
     
      if(newText.length >0)
      {
        //console.log("iffff")
        this.setState({
          buttonVisible:true
        })
      }
      else
      {
        //console.log("elseeeee")

        this.setState({
          buttonVisible:false
        })

      }
      this.setState({number : newText});
      } 

      _selectedValue(index, item) {
        console.log("index " + index  + " item "  +JSON.stringify(item) )
      //   this.setState({
      //       show:false,
      //       //number:'',
      //   },() =>
      //    {
      //       this.setState({ show: true,selectedText: item.flag, codd: item.dial_code ,number:''});
      //   });
      

      //   //this.setState({ show: false })
      // //this.focusTextInput()
      // console.log("Clicked")
      // //this.refs.Phone.focus();
   
      this.setState({ show: false,selectedText: item.flag, codd: item.dial_code ,number:''})

      setTimeout(function(){
        _this.setState({ show: true,selectedText: item.flag, codd: item.dial_code ,number:''})
  
      }, 100);

   // this.ShowAlertWithDelay()

  }
  
    render()
    {

      var notch;

      // let hasNotch = DeviceInfo.hasNotch();
      // if(!hasNotch)
      // {
      //   notch = hp('4%')
      // }
      // else
      // {
      //   notch =0
      // }

      if(StatusBar.currentHeight >24 )
      {
        notch=hp('4%')
      }
      else
      {
        notch=0
      }


      console.log("Heightttttttttttttt " + StatusBar.currentHeight  )


      // if (this.state.loading) {
      //   return (
      //     <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
      //         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      //           <Text>Switching Account</Text>
      //           <ActivityIndicator size="large" color ="#ffffff" />
      //       </View>
      //     </LinearGradient>
      //   );
      // }


        return (
        <LinearGradient colors={['#048de3', '#024875']} style={styles.linearGradient}>
          {/* <KeyboardAvoidingView   style={styles.container} behavior="padding" enabled> */}
          {/* <View style={styles.container}> */}

         {this.state.fromlogin?
          <TouchableOpacity
            style={{ marginLeft:10 ,position:'absolute',top:Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            marginRight: 15, alignSelf:'flex-start',padding:8}}
            onPress={() =>
            this.props.navigation.goBack(null)
          }
            >
            <BackButton width={22} height={22} />

           </TouchableOpacity>
           :
           null
        }

            <View style={{
              alignItems: 'center',
              justifyContent:'flex-start',  
              paddingVertical:hp('3%'),
              flex:0.85,      
            }}>

              <Spinner
              visible={this.state.loading}
              textStyle={styles.spinnerTextStyle}/>


              <Logo width={111} height={103} />
              


              <Text style={{marginTop: hp('3%'),fontSize :hp('3%'),color:"#ffffff" }}> Welcome to KOOPA application</Text>

                <View style={{ 
                  alignSelf: 'center',
                  flexDirection:'row', 
                  justifyContent:'center',
                  marginTop:hp('3%'),
                  }}>


                    {/* <RNPicker
                       dataSource={this.state.dataSource}
                      dummyDataSource={this.state.dataSource}
                      defaultValue={false}
                      pickerTitle={"Select a country"}
                      showSearchBar={true}
                      disablePicker={false}
                      changeAnimation={"none"}
                      searchBarPlaceHolder={"Search....."}
                      showPickerTitle={true}
                      
                      searchBarContainerStyle={this.props.searchBarContainerStyle}
                      pickerStyle={Styles.pickerStyle}
                      pickerItemTextStyle={Styles.listTextViewStyle}
                      selectedLabel={this.state.selectedText}
                      placeHolderLabel={this.state.dataSource[0].flag}
                      selectLabelTextStyle={Styles.selectLabelTextStyle}
                      placeHolderTextStyle={Styles.placeHolderTextStyle}
                      dropDownImageStyle={Styles.dropDownImageStyle}
                      dropDownImage={require("../../../assets/dropDown.png")}
                      selectedValue={(index, item) => this._selectedValue(index, item)}
                    /> */}

                       <TouchableOpacity
                       style={{ flexDirection:'row',width:'30%',
                       borderBottomWidth:1,
                       // flexDirection:'row',
                       paddingLeft:3,
                        borderBottomColor: '#a5a5a4',
                      }}
                      onPress={()=> this.props.navigation.navigate('CountryPicker',this.state.fromlogin?{ 'fromregister':true}:{ 'fromregister':false})}
                      >
                       
                       <View
                     style={{ 
                       width: 35,
                       justifyContent: 'center',
                       alignItems: 'center',
                       //borderBottomWidth:1,
                       flexDirection:'row',
                       //borderBottomColor: '#a5a5a4',
                      }}
                     //onPress={()=> this.props.navigation.navigate('CountryPicker')}
                     >
                       <Text style={{ fontSize: 18, color: 'white',marginLeft:10}}>{this.state.selectedText}</Text>

                    <View
                      style={{ marginLeft:10}}
                    >
                       <Image
                        style={{ width: 14, height: 14}}
                        source={require('../../../assets/dropdownpicker.png')}
                      />
                    </View>

                    </View>

                   <TextInput 
                      editable= {false}
                      placeholderTextColor='white'
                      value ={this.state.codd}
                      onChangeText={(index, item) => this._selectedValue(index, item)} 
                      blurOnSubmit ={false}
                      autoCorrect={false}
                      style={{fontSize :14, color: 'white',
                      //borderBottomWidth:1,
                      //borderBottomColor: '#a5a5a4',
                      //width:'20%',
                      //backgroundColor:'red',
                      marginLeft: 20,
                      height : 50, 
                      textAlign: 'center',
                      }}></TextInput>

                     </TouchableOpacity>




                    {this.state.show ?
                    <TextInput 
                    // editable= {false}
                      //ref={(ref)=>{this.textInput = ref}}
                      ref='Phone'
                      placeholder=" Phone Number" 
                      placeholderTextColor='white'
                      keyboardType={"numeric"} 
                      value ={this.state.number
                      }
                      autoFocus={true}
                      autoCorrect={false}
                      onChangeText={phone => { this.changeText(phone)}} 
                      style={{fontSize :14, color: 'white',
                      borderBottomWidth:1,
                      borderBottomColor: '#a5a5a4',
                      // backgroundColor:"#ffffff",
                      width:'55%',
                     }}></TextInput>
                      
                      :
                      <Text style={{fontSize :14, color: 'white',
                      borderBottomWidth:1,
                      borderBottomColor: '#a5a5a4',
                       textAlignVertical:'center',
                      width:'55%',
                      }}></Text>
                      
                    }

                  </View>

                    <View >
                       <Text style={{fontSize : 13,color:"#dddddd",marginTop:5,paddingHorizontal:20}}>Other text TBD goes here</Text>
                    </View>
                     
            </View>   
            {this.state.visible ? 
                <View style= {styles.bottomContainer}>
                    {this.state.buttonVisible ?
                      <TouchableOpacity
                          onPress ={() => this.RegisterNumber()}
                          >
                            <Image  
                            style={{width:100,height:50}}
                              source={require('../../../assets/next.png')} />
                      </TouchableOpacity>
                      :
                      null
                    }
            
                </View>
              :             
                <View 
                  style= {{ position:'absolute',
                  bottom:this.state.keyboardheight==0? (parseInt(10)) :(parseInt(this.state.keyboardheight) + parseInt(notch)),
                  justifyContent:'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                  paddingBottom:8,
                  right:5,
                  }}>

                      {this.state.buttonVisible ?
                        <TouchableOpacity
                        style={{marginRight:10}}
                            onPress ={() => this.RegisterNumber()}
                            >
                              <Image  
                              style={{width:45,height:45}}
                                source={require('../../../assets/next.png')} />
                        </TouchableOpacity>
                        :
                        null
                      }            
                  </View>
            }
            {/* </View> */}
            {/* </KeyboardAvoidingView> */}
          </LinearGradient>       
        );
      
      }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
  },
  
  innerContainer :{
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
   //paddingTop:30,
  // backgroundColor:'red',
   //marginTop:hp('18%'),
    //height:hp('70%'),
    
  } ,
  bottomContainer :{
    position:'absolute',
    bottom:10,
    alignSelf:'flex-end',
    //justifyContent:'flex-end',
    marginRight:10,
    alignItems: 'flex-end',   
  } ,
  bottomContainer2 :{
    position:'absolute',
    bottom:'45%',
    justifyContent:'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end'
    //justifyContent: 'center',
    //flexDirection:'row',
    
  } ,
  linearGradient: {
    flex: 1,
    justifyContent: 'center',

    //paddingLeft: 15,
    //paddingRight: 15,
    //borderRadius: 5
  },
});



const Styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },


  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: "row",
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1
    },
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10
  },

  selectLabelTextStyle: {
    color: "white",
    textAlign: 'center',
    marginVertical: 15,
    width: 50,
    flexDirection: "row"
  },
  placeHolderTextStyle: {
    color: "white",
    textAlign: 'center',
    marginVertical: 15,
    width: 50,
    flexDirection: "row"
  },
  dropDownImageStyle: {
    width: 15,
    height: 15,
    alignSelf: "center"
  },
  listTextViewStyle: {
    color: "black",
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: "left",

  },
  pickerStyle: {
    marginLeft: 10,
    elevation:0,
    paddingRight: 15,
    marginRight: 0,
    marginBottom: 0,
    // shadowOpacity: 1.0,
    // shadowOffset: {
    //   width: 1,
    //   height: 1
    // },
    width: 70,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#a5a5a4',
    // shadowRadius: 10,
    // backgroundColor: "rgba(255,255,255,1)",
    // shadowColor: "#d3d3d3",
    flexDirection: "row"
  }
});