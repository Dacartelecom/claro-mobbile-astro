import { type ChangeEvent, type FC, useState } from "react";
import type { FormProps } from "../interfaces/Form.props";
import Modal from "./Modal/Modal";

export const Form: FC<FormProps> = ({
  children,
  modal,
  className
}) => {
  const params = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname;

  const urlDelSitio = window.location.href;
  const nombreDelDominio = urlDelSitio.replace(/^https?:\/\/(?:www\.)?/, '').split('/')[0];

  const [loading, setLoading] = useState<boolean>(false);
  const [length, setLength] = useState<number>(0);
  const [response, setResponse] = useState<null | string>(null);
  const [inputState, setInputState] = useState<string>('');
  const [TSource] = useState(params.get('T-source'));
  const [Gclid] = useState(params.get('gclid'));
  const [isChecked, setIsChecked] = useState(false);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [activeModalForm, setActiveModalForm] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const changeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      if (value.length <= 9) {
        setInputState((_prev) => (value))
      } else {
        setInputState((prev) => (prev))
      }
    }
    setLength(value.length);
  };

  const interval = (error: string) => {
    setResponse(error)
    setTimeout(() => {
      setResponse('')
    }, 3000);
  }



  const sendNumber = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const url = "https://ws-dacar-ica.octopus-latam.com/?";
    const data = new URLSearchParams();
    let service = 'PeruHfcCallme'


    if (nombreDelDominio.includes("clarofertas")) {
      if (TSource === 'ext') {
        data.append("service", "PeruHfcResi");
        data.append("username", "dacar");
        data.append("password", "O8Sw36BwGurYZcFU9vsa");
        service = "PeruHfc2"
      } else if (TSource === 'ext_1') {
        data.append("service", "PeruMovilRsCallme");
        data.append("username", "dacar");
        data.append("password", "StzsK46vs0a4nCJU55wD");
        service = "PeruHfc3"
      } else if (TSource === 'ext_2') {
        data.append("service", "PeruMovilResi");
        data.append("username", "dacar");
        data.append("password", "O8Sw36BwGurYZcFU9vsa");
        service = "PeruHfc5"
      } else if (TSource === 'ext_3') {
        data.append("service", "PeruHfcRsCallme");
        data.append("username", "dacar");
        data.append("password", "StzsK46vs0a4nCJU55wD");
        service = "PeruMovilCallme"
      } else {
        data.append("service", "PeruHfcResi");
        data.append("username", "dacar");
        data.append("password", "O8Sw36BwGurYZcFU9vsa");
      }

    } else {

      if (TSource === '01clarohogar') {
        data.append("service", "PeruHfc1");
        data.append("username", "dacar");
        data.append("password", "O8Sw36BwGurYZcFU9vsa");
        service = "PeruHfc1"
      } else if (TSource === '02clarointernet') {
        data.append("service", "PeruHfc2");
        data.append("username", "dacar");
        data.append("password", "O8Sw36BwGurYZcFU9vsa");
        service = "PeruHfc2"
      } else if (TSource === '03clarotv') {
        data.append("service", "PeruHfc3");
        data.append("username", "dacar");
        data.append("password", "O8Sw36BwGurYZcFU9vsa");
        service = "PeruHfc3"
      } else if (TSource === '05claroperu') {
        data.append("service", "PeruHfc5");
        data.append("username", "dacar");
        data.append("password", "O8Sw36BwGurYZcFU9vsa");
        service = "PeruHfc5"
      } else if (TSource === '06claromovil') {
        data.append("service", "PeruMovilCallme");
        data.append("username", "dacar");
        data.append("password", "StzsK46vs0a4nCJU55wD");
        service = "PeruMovilCallme"
      } else if (pathname.includes('planes-moviles')) {
        data.append("service", "PeruMovilCallme");
        data.append("username", "dacar");
        data.append("password", "StzsK46vs0a4nCJU55wD");
        service = "PeruMovilCallme"
      } else {
        data.append("service", "callmeClaroMovilPeru");
        data.append("username", "dacarEs");
        data.append("password", "3Dxwii9qvuC8TXeRG28psQ");
      }

    }



    data.append("telephone", inputState);

    if (TSource) {
      data.append("tsource", TSource);
    } else {
      data.append("tsource", "");
    }

    if (Gclid) {
      data.append("gclid", Gclid);
    } else {
      data.append("gclid", "");
    }

    data.append("ip", "127.0.0.1");

    const lead = url + data.toString();

    fetch(lead)
      .then((res) => res.json())
      .catch((error) => console.log(error))
      .then((response) => {
        console.log(response)
        console.log(lead)
        if (response.status === 'ERROR') {
          interval('Estimado cliente el número debe tener 9 dígitos o esta mal colocado.')
          setLoading(false);
        } else {
          interval('¡Gracias por contactarnos! En breve, un asesor se pondrá en contacto contigo.');
          setLoading(false);
        }
        setInputState(() => (''));
        console.log(service);

      });
  }

  return (
    <form className={` w-[420px] max-lg:w-[300px] ${response && 'h-[380px]'} h-[320px] bg-white rounded-md ${modal ? 'top-[100px] right-[5%] max-lg:top-[10px] max-lg:right-0' : ''}  text-[#222222] ${ className }`}
      onSubmit={sendNumber}>
      <div className='w-full h-full flex flex-col justify-center p-[20px] gap-[10px]'>
        {children}
        <div className='flex flex-col justify-center text-[#B7202E]'>
          <span className='text-[16px]'> Déjanos tu número y te llamaremos </span>
          <input
            type="text"
            id="number-form"
            className='outline-none border-b-2 border-x-0 border-[#B7202E]'
            placeholder="987654321"
            pattern="[0-9]{1,9}"
            maxLength={9}
            value={inputState}
            onChange={changeNumber}
          />
        </div>
        <div className='flex gap-2 text-[#B7202E]'>
          <input className='border-[#B7202E]' type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange} />
          <span>Acepto los <span onClick={() => setActiveModal(true)} className="duration-300 transition-all hover:text-[#1F97AE] cursor-pointer">Términos y Condiciones</span></span>
        </div>
        <div className='w-full flex justify-center'>
          <button
            type='submit'
            disabled={length === 9 && isChecked === true ? false : true}
            className={`bg-[#1F97AE] w-[200px] h-[40px] ${length === 9 && isChecked === true ? 'opacity-100 hover:border hover:border-[#1F97AE] hover:bg-white hover:text-[#1F97AE] ' : 'opacity-50'} border-white rounded-xl text-white transition-all duration-500`}>solicitar llamada {loading && <span className="loader"></span>}</button>
        </div>
        <div>
          {response && <span className="text-[#46b450] text-xl text-center font-bold mt-4 w-[300px]">{response}</span>}
        </div>
      </div>
      <Modal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        background="#fff"
        buttonEnd
      >
        <>
          <h6 className="text-3xl text-start font-bold w-full mb-4">Términos y condiciones</h6>
          <ul className="text-justify text-gray-500 [&>li]:mb-1">
            <li><span>
              El presente documento establece los términos y condiciones generales (en adelante, los “Términos
              y Condiciones”) aplicables al uso del <span className="text-gray-800">sitio web</span>  <span className="text-[#B7202E]"> planesmoviles.com.pe</span> puesto
              a disposición del público en general (en adelante, indistintamente, el “Usuario” o los “Usuarios”) por parte
              de TELETALK S.A.C (en adelante, la “Empresa”) para la comercialización de productos y
              servicios prestados por América Móvil Perú S.A.C. (en adelante, “CLARO”). El Usuario que desee usar el Sitio
              podrá hacerlo sujetándose a los Términos y Condiciones. LOS PRESENTES TÉRMINOS Y CONDICIONES
              TIENEN UN CARÁCTER OBLIGATORIO Y VINCULANTE, POR LO QUE CUALQUIER USUARIO QUE NO ACEPTE
              ESTOS TÉRMINOS Y CONDICIONES DEBERÁ ABSTENERSE DE UTILIZAR EL SITIO.
              El Usuario debe leer todas las condiciones establecidas en estos Términos y Condiciones, así como en los
              demás documentos incorporados en el Sitio previo al uso del Sitio.
              La aceptación expresa de los Términos y Condiciones que se establecen a continuación y/o el mero uso del
              Sitio que haga el Usuario, implica que el Usuario declara haber sido previamente informado de, así como
              haber leído, comprendido y aceptado, estos Términos y Condiciones, así como las condiciones
              particulares o modificaciones que respecto de ellas se puedan efectuar, a todas las cuales el Usuario se
              adhiere plenamente y sin reservas.
            </span></li>
            <li><span>
              El Usuario declara y garantiza estar apto y tener capacidad legal para aceptar los presentes Términos y
              Condiciones y que toda la información que proporcione a la Empresa en el marco del Sitio, bajo cualquier
              forma, será exacta, verdadera, completa y correcta; liberando de cualquier responsabilidad sobre el
              particular a la Empresa y a CLARO. En ese sentido, para efectos de las exoneraciones de responsabilidad,
              CLARO comprende también a cualquiera de sus respectivos directores, funcionarios, empleados u otros
              representantes.
            </span></li>
            <li><span className="text-gray-800">
              1.Responsabilidad limitada
            </span></li>
            <li>
              <span>El Usuario declara haber comprendido y aceptado que toda información, comunicación, opinión,
                manifestación, contenido, transacción u operación a la que acceda a través del Sitio es de exclusiva
                responsabilidad de la Empresa; reconociendo el Usuario que el uso del Sitio y la confianza que asigne al
                mismo son bajo su propio riesgo.En ese sentido, el Usuario declara haber comprendido y aceptado que, por
                ser el Sitio un espacio de propiedad de la Empresa y administrado exclusivamente por ella, CLARO no
                respalda ni garantiza la información, comunicaciones, opiniones, manifestaciones, contenido,
                transacciones u operaciones a las que el Usuario acceda a través del Sitio; por lo cual el Usuario libera de
                cualquier responsabilidad sobre el particular a CLARO.</span>
            </li>
            <li><span className="text-gray-800">
              2.Limitaciones y modificación de las condiciones aplicables al Sitio
            </span></li>
            <li>
              <span>La Empresa expresamente se reserva la facultad y puede efectuar, en cualquier momento, bajo su
                exclusiva discreción y sin previo aviso, modificaciones sobre estos Términos y Condiciones. Las
                modificaciones entrarán en vigor inmediatamente después de que aparezcan publicadas por cualquier
                medio, sin necesidad de notificación alguna al Usuario. En los casos en que la Empresa estime conveniente
                realizar alguna notificación, ésta se efectuará por cualquier medio incluyendo, sin limitaciones, anotación
                en el sitio web <span className="text-[#B7202E]">www.sitiodistribuidor.com</span>, correo electrónico u otros mecanismos electrónicos o
                convencionales de correos o comunicaciones, o cualquier otro método equivalente. Es recomendable que
                el Usuario revise en forma periódica el Sitio a fin de informarse de las modificaciones que puedan haberse
                introducido; la continuación en el uso del Sitio, implicará la aceptación sin reservas a dichas modificaciones
                por parte del Usuario.</span>
            </li>
            <li><span className="text-gray-800">
              3.Suspensión
            </span></li>
            <li>
              <span>La Empresa se reserva el derecho de suspender en cualquier momento, temporalmente y sin previo aviso, el
                Sitio, por el tiempo que resulte necesario. Ello incluye la eventual necesidad de efectuar operaciones de
                mantenimiento, reparación, actualización o mejora de las mismas o causas similares.</span>
            </li>
            <li><span className="text-gray-800">
              4.Fuerza mayor
            </span></li>
            <li>
              <span>La Empresa no garantiza la inexistencia de interrupciones o errores en el acceso al Sitio, ni será
                responsable de los retrasos o fallos que se produjeran en el acceso, funcionamiento y operatividad del
                Sitio, sus servicios y/o contenidos, así como tampoco de las interrupciones, suspensiones o el mal
                funcionamiento del mismo, cuando tuvieren su origen en fallas producidas por causas ajenas a su voluntad
                o fuera de su control o por cualquier otra situación de caso fortuito o fuerza mayor. </span>
            </li>
            <li><span className="text-gray-800">
              5.Derechos de autor y marca
            </span></li>
            <li>
              <span>Todos los contenidos, marcas, textos e imágenes gráficas de este Sitio están sujetos a los derechos de la
                Empresa, y en lo que corresponda, a los derechos de CLARO, protegidos por las leyes de la propiedad
                intelectual e industrial y derechos de autor. En ningún caso el acceso a este Sitio implica ningún tipo de
                renuncia, transmisión o cesión total ni parcial de dichos derechos, ni confiere ningún derecho de utilización,
                alteración, explotación, reproducción, distribución o comunicación pública sobre dichos contenidos sin la
                previa y expresa autorización específicamente otorgada a tal efecto por parte de la Empresa o de CLARO o
                del tercero titular de los derechos afectados. En función de lo anterior y sin perjuicio de las demás
                obligaciones que emanan del reconocimiento de los derechos de la Empresa o de CLARO protegidos por las
                leyes de la propiedad intelectual e industrial y derechos de autor, el Usuario está prohibido de transmitir,
                distribuir, reproducir, publicitar bajo cualquier modalidad o en general utilizar los contenidos, marcas, textos
                e imágenes gráficas de este Sitio para fines comerciales; modificar o utilizar la información sin la
                autorización previa, expresa y escrita de la Empresa o CLARO; o, transferir los contenidos, marcas, textos e
                imágenes gráficas de este Sitio a terceros, salvo que se advierta a dichos terceros de manera expresa
                respecto de la titularidad de la Empresa o CLARO de los derechos de autor y las limitaciones impuestas al
                uso de dichos contenidos, marcas, textos o imágenes gráficas. Las prohibiciones antes mencionadas son a
                título enunciativo y no taxativo, por lo que se extenderán a todas aquellas que se deriven del respeto y
                reconocimiento de los derechos de la Empresa o de Claro protegidos por las leyes de la propiedad
                intelectual e industrial y derechos de autor.</span>
            </li>
            <li><span className="text-gray-800">
              6. Uso del sitio bajo responsabilidad
            </span></li>
            <li>
              <span>El uso de este Sitio o de cualquier área del mismo o de todo o parte de la información o contenidos
                incorporados en el mismo, o el solicitar cualquier producto o servicio mediante este Sitio, o el aprobar
                cualquier material o información, se hace bajo la única y exclusiva responsabilidad del Usuario que accede
                al mismo. La Empresa no garantiza que el uso del Sitio será ininterrumpido y sin posibilidad de errores. La
                Empresa no asume responsabilidad alguna derivada de los contenidos de los enlaces de terceros que se
                puedan encontrar en el Sitio, ni garantiza la ausencia de virus u otros elementos en los mismos que puedan
                producir alteraciones o daños en el sistema informático del Usuario (hardware y/o software) o sus archivos
                o ficheros.</span>
            </li>
            <li><span className="text-gray-800">
              7. Vigencia, interrupción y terminación del Sitio
            </span></li>
            <li>
              <span>El Sitio estará disponible por tiempo indefinido. La Empresa en cualquier momento, sin previo aviso, podrá
                interrumpir, desactivar, denegar, bloquear, dar por terminado el acceso o cancelar, en todo o parte, el Sitio,
                por cualquier razón, incluyendo, sin limitación, la detección de cualquier tipo de acto u omisión que, a juicio
                y a sola discreción de la Empresa, se considere como una violación a estos Términos y Condiciones, a otras
                condiciones aplicables o a las que emanen de la normativa vigente, sin que ello genere para La Empresa
                responsabilidad de clase alguna.
                La Empresa no asumirá responsabilidad alguna frente al Usuario o frente a terceros por ninguna de las
                acciones antes mencionadas. Ni la interrupción, desactivación, denegación, bloqueo, terminación del
                acceso, desactivación del Sitio ni cualquier acción u omisión del Usuario implicará la pérdida de vigencia de
                estos Términos y Condiciones.
              </span>
            </li>
            <li><span className="text-gray-800">
              8. Interpretación
            </span></li>
            <li>
              <span>Los títulos de las cláusulas o numerales son meramente orientadores y no forman parte del contenido
                preceptivo de estos Términos y Condiciones. Los términos y condiciones que integran los presentes
                Términos y Condiciones constituyen la expresión formal y definitiva de la declaración de voluntad de las
                partes, debiendo interpretarse los unos por los otros atribuyendo a los dudosos el sentido que se derive del
                conjunto de todos. La eventual nulidad o ineficacia de algunas de las estipulaciones, no afecta ni invalida la
                eficacia u obligatoriedad de las demás contenidas en los presentes Términos y Condiciones. Cualesquiera
                documentos o declaraciones previos a la entrada en vigor de los presentes Términos y Condiciones se
                considerarán definitivamente derogados.</span>
            </li>
            <li><span className="text-gray-800">
              9. Competencia
            </span></li>
            <li>
              <span>Todas las cuestiones relacionadas al uso del Sitio se rigen por las leyes peruanas. La Empresa y el Usuario
                hacen renuncia expresa a cualquier otro fuero y convienen que cualquier controversia derivada de su uso o
                aplicación será sometida a la jurisdicción de los Juzgados y Tribunales competentes de Lima, Perú. En el
                caso de que el Usuario tenga su domicilio fuera de Perú, la Empresa y el Usuario se someten, con renuncia
                expresa a cualquier otro fuero, a los juzgados y tribunales competentes de Lima, Perú.</span>
            </li>
          </ul>
        </>
      </Modal>
    </form>
  )
}
