import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL,  messagePageSize, languageMapping, CONTACT_EMAIL, CONTACT_PHONE, SENDER_EMAIL, GMAIL_PASSWORD } from '../utils'
import { createTransport } from "nodemailer";

const constantsFromStorage = localStorage.getItem("constants") ? JSON.parse(localStorage.getItem("constants")) : {}

const initialState = {
      constants:constantsFromStorage,
      loading:false,
      error:null,
}


export const getConstants = createAsyncThunk("constants/getConstants", async () => {
      try {
            const response = await fetch(`${BASE_URL}/api/constants/get/`, {method: "GET"})
            if (!response.ok) {

                                                
                  const error_email_subject = 'ERROR DE CARGA DE CONSTANTES';
                  const error_email_content = `
                  <html>
                  <head></head>
                  <body>
                        <h4>ERROR</h4>
                        <p>Hubo un error de carga al intentar descargar las constantes desde la base de datos.</p>
                        <p><small>Este correo es destinado para ser recibido por un administrador de aprende.pe</small></p>
                  </body>
                  </html>
                  `;

                  const transporter = createTransport({
                        service: 'gmail',
                        auth: {
                        user: SENDER_EMAIL,
                        pass: GMAIL_PASSWORD
                        }
                  });

                  const mailOptions = {
                        from: SENDER_EMAIL, // sender address
                        to: CONTACT_EMAIL, // list of receivers
                        subject: error_email_subject, // Subject line
                        html: error_email_content // html body
                  };

                  transporter.sendMail(mailOptions, () => {
                        console.log(`ERROR CARGANDO DATOS, por favor escribirnos al ${CONTACT_EMAIL}`);
                      });
            }
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});




// Create a userInfo slice
export const constantSlice = createSlice({
      name: "constants",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
            builder
            //GET CONSTANTS
            .addCase(getConstants.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(getConstants.fulfilled, (state, action) => {
                  localStorage.setItem("constants", JSON.stringify(action.payload))
                  return { ...state, constants:action.payload, loading:false }
            })
            .addCase(getConstants.rejected, (state, action) => {
                  return { constants:{}, loading:false, error: action.error.message }
            })
            
      },
});

export default constantSlice.reducer


