/**
 * Компонент отображения формы ввода личных данных в создании/редактировании агента
 * from: ProfileInfo
 */
import PropTypes from "prop-types";
import moment from "moment";

import withValidate from "../../utils/injectValidate";
import localStor from "../../utils/browser/localStorage";
import { validateInput } from "../../utils/validate";
import { EmptyNoBorder } from "../../CommonStyled";
import Subscribe from "../Subscribe";
import { DicesIcon, WarningIcon, SuccessIcon } from "../../Icons";
import {
  Input,
  DateInput,
  SuggestionsInput,
  RadioButtons,
  Checkbox,
  FormRow,
  Button,
  Spinner,
  Range,
} from "../../UiComponents";

export const ProfileInfo = (props) => {
  const {
    userInfo,
    newUser,
    setValue,
    validate,
    internalErrors,
    errorsServer,
    removeError,
    loading,
    permissions,
    rejectSet,
    isJuridical,
    sendForInspection,
    isManager,
    sendAgentCard,
    // surnameSuggestions,
    // firstNameSuggestions,
    // patronymicSuggestions,
    phoneVerification,
    username,
    openModal,
    subscribe,
    setSubscribe,
    // personInputs,
    // paymentInfo,
    whatsApp,
    whatsAppSetNotifications,
  } = props;

  const showError = (internalErrors, errorsServer) => {
    if (!errorsServer && !errorsServer.isArray()) return null;

    errorsServer.forEach((elem) => {
      internalErrors[elem.key] = elem.message;
      if (elem.key === "usernameCanonical") {
        internalErrors.username = elem.message;
      }
      if (elem.key === "emailCanonical") {
        internalErrors.email = elem.message;
      }
    });
  };

  const generatePassword = () => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-=!@#№$;%^:&?*()_+";
    const length = 10;
    let result = "";

    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return result;
  };

  if (loading) {
    return (
      <EmptyNoBorder>
        <Spinner />
      </EmptyNoBorder>
    );
  }

  const setIsJuridical = (value) => {
    if (permissions.editJuridical) {
      setValue(["userInfo", "isJuridical"], value);
    } else {
      rejectSet(`Если вы хотите работать как юридическое лицо, то необходимо заключить с нами договор. Для этого вам нужно обратиться в тех. поддержку по телефону
      +7 (800) 550-50-43,
      либо написать на почту docs@rosstrah.ru, в теме письма указав свой логин`);
    }
  };

  showError(internalErrors, errorsServer);

  return (
    <>
      <FormRow>
        <Input
          id="username"
          label="Логин"
          disabled={!permissions.editUsername}
          autoComplete="off"
          value={userInfo.username}
          onChange={(value) => setValue(["userInfo", "username"], value)}
          onBlur={(value) => {
            validate("username", value);
          }}
          error={
            internalErrors.username ||
            errorsServer.find((el) =>
              ["username", "usernameCanonical"].includes(el.key)
            )
          }
        />

        {permissions.editPassword && (
          <Input
            id="password"
            error={
              internalErrors.password ||
              errorsServer.find((el) => el.key === "password")
            }
            label="Пароль"
            value={userInfo.password}
            autoComplete="off"
            onChange={(value) => setValue(["userInfo", "password"], value)}
            onBlur={(value) => {
              if (newUser) validate("password", value);
            }}
            after={
              <Button
                type="text"
                tooltip="сгенерировать"
                onClick={(e) => {
                  e.preventDefault();
                  setValue(["userInfo", "password"], generatePassword());
                }}
              >
                <DicesIcon />
              </Button>
            }
          />
        )}
        <Input
          id="surname"
          error={internalErrors.surname}
          label="Фамилия"
          placeholder="Иванов"
          disabled={!permissions.editFIO}
          value={userInfo.surname}
          onChange={(value) => setValue(["userInfo", "surname"], value)}
          onBlur={(value) => {
            validate("surname", value);
          }}
        />
        <Input
          id="firstname"
          error={internalErrors.firstname}
          placeholder="Иван"
          label="Имя"
          disabled={!permissions.editFIO}
          value={userInfo.firstname}
          onChange={(value) => setValue(["userInfo", "firstname"], value)}
          onBlur={(value) => {
            validate("firstname", value);
          }}
        />
        <Input
          id="patronymic"
          placeholder="Иванович"
          label="Отчество"
          disabled={!permissions.editFIO}
          value={userInfo.patronymic}
          onChange={(value) => setValue(["userInfo", "patronymic"], value)}
        />
      </FormRow>
      <FormRow>
        <RadioButtons
          id="isJuridical"
          value={isJuridical}
          onChange={(value) => setIsJuridical(value)}
          list={[
            { title: "Физическое лицо", value: false },
            { title: "Юридическое лицо", value: true },
          ]}
        />
        {isJuridical ? (
          <Input
            maxLength="12"
            id="inn"
            label="ИНН"
            value={userInfo.inn}
            onChange={(value) => {
              if (
                /^[\d]{0,12}$/.test(value) ||
                value.length < userInfo.inn.length
              )
                return setValue(["userInfo", "inn"], value);
            }}
          />
        ) : (
          <>
            <Input
              placeholder="9999"
              label="Серия паспорта"
              maxLength="4"
              error={internalErrors.series}
              id="series"
              size="xs"
              value={userInfo.series}
              onChange={(value) => {
                if (
                  /^[\d]{0,4}$/.test(value) ||
                  value.length < userInfo.series.length
                )
                  return setValue(["userInfo", "series"], value);
              }}
              onBlur={(value) => {
                validate("series", value, {
                  documentType: "passport",
                });
              }}
            />
            <Input
              placeholder="123456"
              label="Номер паспорта"
              maxLength="6"
              size="xs"
              error={internalErrors.number}
              id="number"
              value={userInfo.number}
              onChange={(value) => {
                if (
                  /^[\d]{0,6}$/.test(value) ||
                  value.length < userInfo.number.length
                )
                  return setValue(["userInfo", "number"], value);
              }}
              onBlur={(value) => {
                validate("number", value, {
                  documentType: "passport",
                });
              }}
            />
            <DateInput
              label="Дата рождения"
              error={internalErrors.birthday}
              id="birthday"
              value={userInfo.birthday}
              onChange={(value) => {
                if (
                  /^[.\d]{0,10}$/.test(value) ||
                  value.length < userInfo.birthday.length
                )
                  return setValue(["userInfo", "birthday"], value);
              }}
              onBlur={(value) => {
                validate("birthday", value);
                if (userInfo.issuedAt)
                  validate("issuedAt", userInfo.issuedAt, {
                    documentType: "passport",
                    birth: value,
                  });
                if (moment(value, "DD.MM.YYYY").isValid()) {
                  setValue(
                    ["userInfo", "birthday"],
                    moment(value, "DD.MM.YYYY").format("DD.MM.YYYY")
                  );
                }
              }}
            />
            <Input
              // placeholder=''
              label="СНИЛС"
              maxLength="11"
              id="snils"
              value={userInfo.snils}
              onChange={(value) => {
                if (
                  /^[\d]{0,11}$/.test(value) ||
                  value.length < userInfo.snils.length
                )
                  return setValue(["userInfo", "snils"], value);
              }}
            />
          </>
        )}
      </FormRow>
      <FormRow>
        <Input
          id="email"
          label="Электронная почта"
          size="lg"
          error={internalErrors.email}
          disabled={!permissions.editEmail}
          value={userInfo.email}
          onChange={(value) => setValue(["userInfo", "email"], value)}
          onBlur={(value) => {
            validate("email", value);
          }}
        />
        <Input
          id="phone"
          error={internalErrors.phone}
          disabled={!permissions.editPhone}
          label="Телефон"
          value={userInfo.phone}
          onChange={(value) => setValue(["userInfo", "phone"], value)}
          onBlur={(value) => {
            validate("phone", value);
          }}
          after={
            username === userInfo.username && (
              <Button
                type="text"
                tooltip={
                  phoneVerification
                    ? "Ваш номер подтверждён"
                    : "Ваш номер не подтверждён"
                }
                mode={phoneVerification ? "success" : "error"}
                onClick={
                  localStor.getSwitchUser()
                    ? () => {}
                    : phoneVerification
                    ? (e) => e.preventDefault()
                    : (e) => {
                        e.preventDefault();
                        openModal("verificationPhoneModal");
                      }
                }
              >
                {phoneVerification ? <SuccessIcon /> : <WarningIcon />}
              </Button>
            )
          }
        />
        {username === userInfo.username &&
          whatsApp &&
          whatsApp.bot_enabled &&
          (whatsApp.bot_started ? (
            <Button
              inline
              onClick={(e) => {
                e.preventDefault();
                whatsAppSetNotifications(!whatsApp.notify_enabled);
              }}
            >
              {whatsApp.notify_enabled
                ? "Отключить уведомления Whatsapp"
                : "Подключить уведомления Whatsapp"}
            </Button>
          ) : (
            <Button
              inline
              onClick={() =>
                openModal("whatsAppAuthModal", {
                  link: whatsApp["redirect_url"],
                })
              }
            >
              Подключить бота Whatsapp
            </Button>
          ))}
        <SuggestionsInput
          id="address"
          placeholder="Регион, город, улица"
          name="address"
          size="xl"
          value={userInfo.address}
          label="Адрес"
          list={userInfo.addressList}
          keyName="text"
          onBlur={(address) => {
            validate("addressInProfile", address);
            removeError("addressInProfile");
          }}
          onChange={setValue}
          error={internalErrors.addressInProfile}
        />
      </FormRow>
      {permissions.editNote && (
        <FormRow>
          <Input
            id="description"
            rows="3"
            size="stretch"
            label="Примечание"
            disabled={!permissions.editNote}
            value={userInfo.notes}
            onChange={(value) => setValue(["userInfo", "notes"], value)}
          />
        </FormRow>
      )}
      {username === userInfo.username && userInfo.workHours && (
        <>
          Рабочие часы
          <FormRow>
            <Range
              step={1}
              min={0}
              max={23}
              values={userInfo.workHours}
              onChange={(value) => setValue(["userInfo", "workHours"], value)}
            />
          </FormRow>
        </>
      )}
      {false && props.username === userInfo.username && (
        <FormRow>
          <Checkbox
            id="canPrecalculation"
            checked={props.canPrecalculation}
            disabled={!phoneVerification}
            onChange={() =>
              props.setCanPrecalculation(!props.canPrecalculation)
            }
            withoutLabel
            big
          >
            Разрешить бронирование (доступно только для пользователей c
            подтверждённым номером телефона)
          </Checkbox>
        </FormRow>
      )}
      {false && isManager && !newUser && (
        <FormRow>
          <Checkbox
            id="sendTrue"
            checked={!!sendForInspection.needToSend}
            onChange={() =>
              setValue(
                ["sendForInspection", "needToSend"],
                !sendForInspection.needToSend
              )
            }
          >
            Передать данные на ТО
          </Checkbox>
          <Input
            id="sendForInspectionEmail"
            label="Электронная почта"
            value={sendForInspection.email}
            onChange={(e) =>
              setValue(["sendForInspection", "email"], e.target.value)
            }
            onBlur={(e) => {
              validate("inspectionEmail", e.target.value);
            }}
          />
          <Button
            inline
            disabled={
              sendForInspection.sended === "sending" ||
              internalErrors["inspectionEmail"]
            }
            onClick={(e) => {
              e.preventDefault();
              sendAgentCard(userInfo.username, sendForInspection.email);
            }}
          >
            {sendForInspection.sended === "success"
              ? "Отправлено"
              : "Отправить"}
          </Button>
        </FormRow>
      )}
      {/* <SubTitle>Платёжная информация</SubTitle>
      <p>Карту необходимо указывать "Сбербанк".</p>
      <p>
        *если у Вас нет карты "Сбербанк" Вы можете указать карту лица, которому
        доверяете.
      </p>
      <PaymentInfo
        fields={personInputs}
        paymentInfo={paymentInfo}
        isJuridical={isJuridical}
        setValue={setValue}
        permissions={permissions}
        rejectSet={rejectSet}
      /> */}
      {permissions.editSubscribe && (
        <Subscribe values={subscribe} setValue={setSubscribe} />
      )}
    </>
  );
};

ProfileInfo.propTypes = {
  errorsServer: PropTypes.array,
  userInfo: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default withValidate(validateInput)(ProfileInfo);
