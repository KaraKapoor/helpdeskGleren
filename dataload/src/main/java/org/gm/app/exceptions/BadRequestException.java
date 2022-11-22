package org.gm.app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.BAD_REQUEST, reason="Input provided is not correct.")
public class BadRequestException extends RuntimeException{

	private static final long serialVersionUID = 7271992345692293895L;

}
