package org.gm.app.util;

import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Currency;
import java.util.Locale;

import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.UIManager;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.JTableHeader;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableColumnModel;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class Database2Excel {

	public static void main(String[] args) throws Exception {

	}

	public static int writeExcelFile(ResultSet resultSet, String sheetname, String directory, int[] columnWidth, int[] rightalign,
			boolean generateExcel, boolean generateImages) throws Exception {

		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet spreadsheet = workbook.createSheet(sheetname);

		int rowcount = 0;
		XSSFRow row = spreadsheet.createRow(0);
		XSSFCell cell;
		CellStyle style = workbook.createCellStyle();// Create style
		XSSFFont font = workbook.createFont();// Create font
		font.setBold(true);// Make font bold
		style.setFont(font);// set it to bold

		ResultSetMetaData rsmd = resultSet.getMetaData();
		int cols = rsmd.getColumnCount();

		int maxRowInImage = 20;
		Object[][] data = new Object[maxRowInImage][cols];
		String[] columns = new String[cols];
		int imagecount = 1;
		int imageRowCount = 0;
		for (int i = 1; i <= cols; i++) {
			cell = row.createCell(i - 1);
			cell.setCellStyle(style);
			cell.setCellValue(rsmd.getColumnLabel(i));
			columns[i - 1] = rsmd.getColumnLabel(i) + "   ";

		}
		rowcount++;

		/*
		 * -7 BIT -6 TINYINT -5 BIGINT -4 LONGVARBINARY -3 VARBINARY -2 BINARY -1
		 * LONGVARCHAR 0 NULL 1 CHAR 2 NUMERIC 3 DECIMAL 4 INTEGER 5 SMALLINT 6 FLOAT 7
		 * REAL 8 DOUBLE 12 VARCHAR 91 DATE 92 TIME 93 TIMESTAMP 1111 OTHER
		 */
		while (resultSet.next()) {
			row = spreadsheet.createRow(rowcount);
			for (int i = 1; i <= cols; i++) {

				if (rsmd.getColumnType(i) == 12) {// VARCHAR
					cell = row.createCell(i - 1);
					cell.setCellValue(resultSet.getString(i));
					if(resultSet.getString(i)!=null) {
						data[imageRowCount][i - 1] = resultSet.getString(i) + "   ";
					} else {
						data[imageRowCount][i - 1] = "   ";
					}
				} else if (rsmd.getColumnType(i) == 91) {// DATE
					CellStyle cellStyle = workbook.createCellStyle();
					CreationHelper createHelper = workbook.getCreationHelper();
					cellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
					cell = row.createCell(i - 1);
					cell.setCellValue(resultSet.getDate(i));
					cell.setCellStyle(cellStyle);
					if(resultSet.getDate(i)!=null) {
					SimpleDateFormat simpleDateFormat = new SimpleDateFormat(Constants.DATE_PATTERN);
					data[imageRowCount][i - 1] = simpleDateFormat.format(resultSet.getDate(i)) + "   ";
					} else {
						data[imageRowCount][i - 1] =  "   ";
					}
				} else if (rsmd.getColumnType(i) == 93) {// Timestamp
					CellStyle cellStyle = workbook.createCellStyle();
					CreationHelper createHelper = workbook.getCreationHelper();
					cellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy HH:mm:ss"));
					cell = row.createCell(i - 1);
					cell.setCellValue(resultSet.getTimestamp(i));
					cell.setCellStyle(cellStyle);
					if(resultSet.getDate(i)!=null) {
					SimpleDateFormat simpleDateFormat = new SimpleDateFormat(Constants.DATE_PATTERN);
					data[imageRowCount][i - 1] = simpleDateFormat.format(resultSet.getDate(i)) + "   ";
					} else {
						data[imageRowCount][i - 1] =  "   ";
					}
				} else if (rsmd.getColumnType(i) == 8) {// DOUBLE
					cell = row.createCell(i - 1);
					cell.setCellValue(resultSet.getDouble(i));
					NumberFormat numberFormat = NumberFormat.getInstance(new Locale("en", "IN"));
					//numberFormat.setMinimumFractionDigits(2);	
					//if we need to display rupee symbol
					//NumberFormat numberFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
						data[imageRowCount][i - 1] = numberFormat.format(resultSet.getDouble(i)) + "   ";
					
				} else if (rsmd.getColumnType(i) == 4) {// INT
					cell = row.createCell(i - 1);
					cell.setCellValue(resultSet.getInt(i));
					NumberFormat nf1 = NumberFormat.getInstance(new Locale("en","IN"));
					data[imageRowCount][i - 1] = nf1.format(resultSet.getInt(i)) + "   ";
				} else if (rsmd.getColumnType(i) == 3) {// DECiMAL for image count in usage report
					cell = row.createCell(i - 1);
					cell.setCellValue(resultSet.getInt(i));
					NumberFormat nf1 = NumberFormat.getInstance(new Locale("en","IN"));
					data[imageRowCount][i - 1] = nf1.format(resultSet.getInt(i)) + "   ";
				} else {
					System.out.println("Handle for column type " + rsmd.getColumnType(i));
				}

			}

			rowcount++;

			if (generateImages == true) {
				imageRowCount++;

				if (imageRowCount == maxRowInImage) {
					saveImage(data, columns,  imagecount, imageRowCount, cols,  directory, columnWidth, rightalign);

					imagecount++;
					imageRowCount = 0;

					data = null;
					data = new Object[maxRowInImage][cols];
					
					//generateImages=false;

				}
			} 
			
		}
		if (imageRowCount != 0) {
			if(imageRowCount < maxRowInImage) {
				Object[][] datatrimmedarray = new Object[imageRowCount][cols];
				System.arraycopy(data, 0, datatrimmedarray, 0, imageRowCount);
				saveImage(datatrimmedarray, columns,  imagecount, imageRowCount, cols,  directory, columnWidth, rightalign);
			} else {
				saveImage(data, columns,  imagecount, imageRowCount, cols,  directory, columnWidth, rightalign);
			}
			imagecount++;
			imageRowCount = 0;

			data = null;
			data = new Object[maxRowInImage][cols];

		}

		for (int i = 0; i < cols; i++) {
			spreadsheet.autoSizeColumn(i);
		}

		if (generateExcel == true) {
			FileOutputStream out = new FileOutputStream(new File(directory + sheetname + ".xlsx"));
			workbook.write(out);
			out.close();
		}
		workbook.close();

		// System.exit(0);
		System.out.println(sheetname + ".xlsx written successfully");
		if (generateImages == false) {
			imagecount = rowcount;
		}
		return (imagecount-1);
	}
	
	
	private static void saveImage(Object[][] data, String[] columns, int imagecount, int imageRowCount, int cols, String directory, int[] columnWidth, int[] rightalign) throws Exception {
	// Create Image
					UIManager.setLookAndFeel("javax.swing.plaf.nimbus.NimbusLookAndFeel");

					JTable table = new JTable(data, columns);

					TableColumnModel columnModel = table.getColumnModel();
					table.setRowHeight(20);
					JScrollPane scroll = new JScrollPane(table);
					
					int totalwidth = 0;
					for (int k = 0; k < cols; k++) {
						columnModel.getColumn(k).setPreferredWidth(columnWidth[k]);
						totalwidth += columnWidth[k];
						//columnModel.getColumn(k).setWidth(columnWidth[k]);
						// columnModel.getColumn(k).setCellRenderer(new WordWrapCellRenderer());

					}
					totalwidth += 21;
					scroll.setPreferredSize(new Dimension(totalwidth, 100));
					

					DefaultTableCellRenderer rightRenderer = new DefaultTableCellRenderer();
					rightRenderer.setHorizontalAlignment(JLabel.RIGHT);
					
					for (int k=0; k < rightalign.length; k++) {
						table.getColumnModel().getColumn(rightalign[k]).setCellRenderer(rightRenderer);
					}

					JPanel p = new JPanel(new BorderLayout());
					p.add(scroll, BorderLayout.CENTER);

					// JTable must have been added to a TLC in order to render
					// correctly - go figure.
					JFrame f = new JFrame("Never shown");
					f.setContentPane(scroll);
					f.pack();

					JTableHeader h = table.getTableHeader();
					Dimension dH = h.getSize();
					Dimension dT = table.getSize();
					int x = (int) dH.getWidth();
					int y = (int) dH.getHeight() + (int) dT.getHeight();

					scroll.setDoubleBuffered(false);

					BufferedImage bi = new BufferedImage((int) x, (int) y, BufferedImage.TYPE_INT_RGB);

					Graphics g = bi.createGraphics();
					h.paint(g);
					g.translate(0, h.getHeight());
					table.paint(g);
					g.dispose();

					// JOptionPane.showMessageDialog(null, new JLabel(new ImageIcon(bi)));
					ImageIO.write(bi, "png", new File(directory + imagecount + ".png"));

	}

	static class WordWrapCellRenderer extends JTextArea implements TableCellRenderer {
		WordWrapCellRenderer() {
			setLineWrap(true);
			setWrapStyleWord(true);
		}

		public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus,
				int row, int column) {
			setText(value.toString());
			setSize(table.getColumnModel().getColumn(column).getWidth(), getPreferredSize().height);
			if (table.getRowHeight(row) != getPreferredSize().height + table.getRowMargin()) {
				table.setRowHeight(row, getPreferredSize().height + table.getRowMargin());
			}
			// set the text area width (height doesn't matter here)
			// setSize(new Dimension(colWidth, 1));

			// get the text area preferred height and add the row margin
			// int height = getPreferredSize().height + table.getRowMargin();
			return this;
		}
	}

}