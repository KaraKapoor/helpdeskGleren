package org.gm.app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR, reason="Some error has occurred, please contact administrator.")
public class InternalServerException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5167646326616536014L;

}
