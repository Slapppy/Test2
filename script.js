const fieldTranslations = {
  realizationreport_id: "ID отчёта",
  salesSum: "Сумма продаж",
  logisticSalesSum: "Сумма логистики при продажах",
  correctionByNmIdSum: "Коррекция логистики по nm_id",
  correctionByBarcodeSum: "Коррекция логистики по barcode",
  correctionByNmIdAndBarcodeSum: "Коррекция логистики по nm_id и barcode",
  returnsSum: "Сумма возвратов",
  logisticReturnsSum: "Сумма логистики при возвратах",
  cancellationLogisticByNmIdSum: "Покатушки при отмене по nm_id",
  cancellationLogisticByBarcodeSum: "Покатушки при отмене по barcode",
  cancellationLogisticByNmIdAndBarcodeSum: "Покатушки при отмене по nm_id и barcode",
  correctionEkviringByNmIdSum: "Корректировка эквайринга по nm_id",
  correctionEkviringByBarcodeSum: "Корректировка эквайринга по barcode",
  correctionEkviringByBarcodeAndNmIDSum: "Корректировка эквайринга по barcode и nm_id",
  correctionBySaNameSum: "Коррекция логистики по sa_name",
  correctionByNmIdAndSaNameSum: "Коррекция логистики по nm_id и sa_name",
  correctionEkviringBySaNameSum: "Корректировка эквайринга по sa_name",
  correctionEkviringByNmIdAndSaNameSum: "Корректировка эквайринга по nm_id и sa_name",
  cancellationLogisticBySaNameSum: "Покатушки при отмене по sa_name",
  cancellationLogisticByNmIdAndSaNameSum: "Покатушки при отмене по nm_id и sa_name",
  totalByNmId: "Итог по nm_id",
  totalByBarcode: "Итог по barcode",
  totalByNmIdAndBarcode: "Итог по nm_id и barcode",
  totalBySaName: "Итог по sa_name",
  totalByNmIdAndSaName: "Итог по nm_id и sa_name"
};

const input = document.createElement('input');
input.type = 'file';

input.onchange = event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      const lower = str => (str || '').toLowerCase();
      const groupedData = data.reduce((acc, item) => {
        const key = item.realizationreport_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
      const results = {};

      for (const [realizationreport_id, items] of Object.entries(groupedData)) {
        const data2024 = items;
        const salesItems = data2024.filter(i => lower(i.supplier_oper_name) === 'продажа');
        const returnItems = data2024.filter(i => lower(i.supplier_oper_name) === 'возврат');
        const logisticItems = data2024.filter(i => lower(i.supplier_oper_name) === 'логистика');
        const correctionItems = data2024.filter(i => lower(i.supplier_oper_name) === 'коррекция логистики');
        const ekviringCorrectionItems = data2024.filter(i => lower(i.supplier_oper_name) === 'корректировка эквайринга');
        const nmIdsFromSales = new Set(salesItems.map(i => i.nm_id));
        const barcodesFromSales = new Set(salesItems.map(i => i.barcode));
        const saNamesFromSales = new Set(salesItems.map(i => i.sa_name));
        const salesSum = salesItems.reduce((sum, i) => sum + (i.ppvz_for_pay || 0), 0);
        const salesSrids = new Set(salesItems.map(i => i.srid));
        const logisticSalesSum = logisticItems
          .filter(i =>
            salesSrids.has(i.srid) &&
            lower(i.bonus_type_name) === 'к клиенту при продаже'
          )
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const returnsSum = returnItems.reduce((sum, i) => sum + (i.ppvz_for_pay || 0), 0);
        const returnSrids = new Set(salesItems.map(i => i.srid));
        const logisticReturnsSum = logisticItems
          .filter(i =>
            returnSrids.has(i.srid) &&
            lower(i.bonus_type_name) === 'от клиента при возврате'
          )
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const correctionByNmIdSum = correctionItems
          .filter(i => nmIdsFromSales.has(i.nm_id))
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const correctionByBarcodeSum = correctionItems
          .filter(i => barcodesFromSales.has(i.barcode))
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const correctionByNmIdAndBarcodeSum = correctionItems
          .filter(i =>
            nmIdsFromSales.has(i.nm_id) &&
            barcodesFromSales.has(i.barcode)
          )
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const correctionBySaNameSum = correctionItems
          .filter(i => saNamesFromSales.has(i.sa_name))
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const correctionByNmIdAndSaNameSum = correctionItems
          .filter(i =>
            nmIdsFromSales.has(i.nm_id) &&
            saNamesFromSales.has(i.sa_name)
          )
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const correctionEkviringByNmIdSum = ekviringCorrectionItems
          .filter(i => nmIdsFromSales.has(i.nm_id))
          .reduce((sum, i) => sum + (i.ppvz_for_pay || 0), 0);
        const correctionEkviringByBarcodeSum = ekviringCorrectionItems
          .filter(i => barcodesFromSales.has(i.barcode))
          .reduce((sum, i) => sum + (i.ppvz_for_pay || 0), 0);
        const correctionEkviringByBarcodeAndNmIDSum = ekviringCorrectionItems
          .filter(i =>
            nmIdsFromSales.has(i.nm_id) &&
            barcodesFromSales.has(i.barcode)
          )
          .reduce((sum, i) => sum + (i.ppvz_for_pay || 0), 0);
        const correctionEkviringBySaNameSum = ekviringCorrectionItems
          .filter(i => saNamesFromSales.has(i.sa_name))
          .reduce((sum, i) => sum + (i.ppvz_for_pay || 0), 0);
        const correctionEkviringByNmIdAndSaNameSum = ekviringCorrectionItems
          .filter(i =>
            nmIdsFromSales.has(i.nm_id) &&
            saNamesFromSales.has(i.sa_name)
          )
          .reduce((sum, i) => sum + (i.ppvz_for_pay || 0), 0);
        const cancellationLogisticByNmIdSum = logisticItems
          .filter(i =>
            nmIdsFromSales.has(i.nm_id) &&
            (
              lower(i.bonus_type_name) === 'к клиенту при отмене' ||
              lower(i.bonus_type_name) === 'от клиента при отмене'
            )
          )
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const cancellationLogisticByBarcodeSum = logisticItems
          .filter(i =>
            barcodesFromSales.has(i.barcode) &&
            (
              lower(i.bonus_type_name) === 'к клиенту при отмене' ||
              lower(i.bonus_type_name) === 'от клиента при отмене'
            )
          )
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const cancellationLogisticByNmIdAndBarcodeSum = logisticItems
          .filter(i =>
            nmIdsFromSales.has(i.nm_id) &&
            barcodesFromSales.has(i.barcode) &&
            (
              lower(i.bonus_type_name) === 'к клиенту при отмене' ||
              lower(i.bonus_type_name) === 'от клиента при отмене'
            )
          )
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const cancellationLogisticBySaNameSum = logisticItems
          .filter(i =>
            saNamesFromSales.has(i.sa_name) &&
            (
              lower(i.bonus_type_name) === 'к клиенту при отмене' ||
              lower(i.bonus_type_name) === 'от клиента при отмене'
            )
          )
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const cancellationLogisticByNmIdAndSaNameSum = logisticItems
          .filter(i =>
            nmIdsFromSales.has(i.nm_id) &&
            saNamesFromSales.has(i.sa_name) &&
            (
              lower(i.bonus_type_name) === 'к клиенту при отмене' ||
              lower(i.bonus_type_name) === 'от клиента при отмене'
            )
          )
          .reduce((sum, i) => sum + (i.delivery_rub || 0), 0);
        const totalByNmId = salesSum
          - logisticSalesSum
          + (-1 * correctionByNmIdSum)
          - logisticReturnsSum
                      // - returnsSum

            - cancellationLogisticByNmIdSum
          + correctionEkviringByNmIdSum;
        const totalByBarcode = salesSum
          - logisticSalesSum
          - correctionByBarcodeSum
                      // - returnsSum

            - logisticReturnsSum
          - cancellationLogisticByBarcodeSum
          + correctionEkviringByBarcodeSum;
        const totalByNmIdAndBarcode = salesSum
          - logisticSalesSum
          - correctionByNmIdAndBarcodeSum
                      // - returnsSum

            - logisticReturnsSum
          - cancellationLogisticByNmIdAndBarcodeSum
          + correctionEkviringByBarcodeAndNmIDSum;
        const totalBySaName = salesSum
          - logisticSalesSum
          - correctionBySaNameSum
            // - returnsSum

          - logisticReturnsSum
          - cancellationLogisticBySaNameSum
          + correctionEkviringBySaNameSum;
        const totalByNmIdAndSaName = salesSum
          - logisticSalesSum
          - correctionByNmIdAndSaNameSum
            // - returnsSum

          - logisticReturnsSum
          - cancellationLogisticByNmIdAndSaNameSum
          + correctionEkviringByNmIdAndSaNameSum;

        results[realizationreport_id] = {
          realizationreport_id,
          salesSum,
          logisticSalesSum,
          correctionByNmIdSum,
          correctionByBarcodeSum,
          correctionByNmIdAndBarcodeSum,
          correctionBySaNameSum,
          correctionByNmIdAndSaNameSum,
          correctionEkviringByNmIdSum,
          correctionEkviringByBarcodeSum,
          correctionEkviringByBarcodeAndNmIDSum,
          correctionEkviringBySaNameSum,
          correctionEkviringByNmIdAndSaNameSum,
          returnsSum,
          logisticReturnsSum,
          cancellationLogisticByNmIdSum,
          cancellationLogisticByBarcodeSum,
          cancellationLogisticByNmIdAndBarcodeSum,
          cancellationLogisticBySaNameSum,
          cancellationLogisticByNmIdAndSaNameSum,
          totalByNmId,
          totalByBarcode,
          totalByNmIdAndBarcode,
          totalBySaName,
          totalByNmIdAndSaName
        };

        const tableRows = [];
        for (const item of data2024) {
          const reasons = [];
          const opName = lower(item.supplier_oper_name);
          const bonusName = lower(item.bonus_type_name || '');
          let included = false;
          const hasNm = nmIdsFromSales.has(item.nm_id);
          const hasBarcode = barcodesFromSales.has(item.barcode);
          const hasSaName = saNamesFromSales.has(item.sa_name);

          if (opName === 'продажа') {
            included = true;
            reasons.push('Сумма продаж (salesSum)');
          }
          if (opName === 'возврат') {
            included = true;
            reasons.push('Сумма возвратов (returnsSum)');
          }
          if (opName === 'коррекция логистики') {
            const detailReasons = [];
            if (hasNm) {
              detailReasons.push('Коррекция логистики по nm_id');
            } else {
              detailReasons.push(`nm_id=${item.nm_id} не найден среди продаж`);
            }
            if (hasBarcode) {
              detailReasons.push('Коррекция логистики по barcode');
            } else {
              detailReasons.push(`barcode=${item.barcode} не найден среди продаж`);
            }
            if (hasSaName) {
              detailReasons.push('Коррекция логистики по sa_name');
            } else {
              detailReasons.push(`sa_name=${item.sa_name} не найден среди продаж`);
            }
            if (hasNm || hasBarcode || hasSaName) {
              included = true;
            }
            reasons.push(...detailReasons);
          }
          if (opName === 'корректировка эквайринга') {
            const detailReasons = [];
            if (hasNm) {
              detailReasons.push('Корректировка эквайринга по nm_id');
            } else {
              detailReasons.push(`nm_id=${item.nm_id} не найден среди продаж`);
            }
            if (hasBarcode) {
              detailReasons.push('Корректировка эквайринга по barcode');
            } else {
              detailReasons.push(`barcode=${item.barcode} не найден среди продаж`);
            }
            if (hasSaName) {
              detailReasons.push('Корректировка эквайринга по sa_name');
            } else {
              detailReasons.push(`sa_name=${item.sa_name} не найден среди продаж`);
            }
            if (hasNm || hasBarcode || hasSaName) {
              included = true;
            }
            reasons.push(...detailReasons);
          }
          if (opName === 'логистика') {
            let logisticMatched = false;
            const subReasons = [];
            if (salesSrids.has(item.srid) && bonusName === 'к клиенту при продаже') {
              logisticMatched = true;
              included = true;
              reasons.push('Сумма логистики при продажах (logisticSalesSum)');
            } else {
              const reasonParts = [];
              if (!salesSrids.has(item.srid)) {
                reasonParts.push(`SRID=${item.srid} не найден среди продаж`);
              }
              if (bonusName !== 'к клиенту при продаже') {
                reasonParts.push(`bonus_type_name=${item.bonus_type_name} != "К клиенту при продаже"`);
              }
              if (reasonParts.length > 0) {
                subReasons.push('Логистика при продаже НЕ подошла: ' + reasonParts.join('; '));
              }
            }
            if (returnSrids.has(item.srid) && bonusName === 'от клиента при возврате') {
              logisticMatched = true;
              included = true;
              reasons.push('Сумма логистики при возвратах (logisticReturnsSum)');
            } else {
              const reasonParts = [];
              if (!returnSrids.has(item.srid)) {
                reasonParts.push(`SRID=${item.srid} не найден среди возвратов`);
              }
              if (bonusName !== 'от клиента при возврате') {
                reasonParts.push(`bonus_type_name=${item.bonus_type_name} != "От клиента при возврате"`);
              }
              if (reasonParts.length > 0) {
                subReasons.push('Логистика при возвратах НЕ подошла: ' + reasonParts.join('; '));
              }
            }
            const isCancellation = (
              bonusName === 'к клиенту при отмене' ||
              bonusName === 'от клиента при отмене'
            );
            if (hasNm && isCancellation) {
              included = true;
              logisticMatched = true;
              reasons.push('Покатушки при отмене по nm_id');
            } else if (!hasNm && isCancellation) {
              subReasons.push(`Отмена(nm_id=${item.nm_id}), но nm_id не найден среди продаж`);
            }
            if (hasBarcode && isCancellation) {
              included = true;
              logisticMatched = true;
              reasons.push('Покатушки при отмене по barcode');
            } else if (!hasBarcode && isCancellation) {
              subReasons.push(`Отмена(barcode=${item.barcode}), но barcode не найден среди продаж`);
            }
            if (hasSaName && isCancellation) {
              included = true;
              logisticMatched = true;
              reasons.push('Покатушки при отмене по sa_name');
            } else if (!hasSaName && isCancellation) {
              subReasons.push(`Отмена(sa_name=${item.sa_name}), но sa_name не найден среди продаж`);
            }
            if (!isCancellation) {
              subReasons.push(`bonus_type_name=${item.bonus_type_name} != {"К клиенту при отмене","От клиента при отмене"}`);
            }
            if (!logisticMatched) {
              reasons.push('Логистика не подошла ни под один из сценариев (продажа, возврат, отмена)');
              reasons.push(...subReasons);
            }
          }
          if (!included) {
            reasons.push('В итоговые суммы запись не вошла');
          }
          tableRows.push({
            realizationreport_id: item.realizationreport_id,
            doc_type_name: item.doc_type_name,
            supplier_oper_name: item.supplier_oper_name,
            bonus_type_name: item.bonus_type_name,
            srid: item.srid,
            nm_id: item.nm_id,
            barcode: item.barcode,
            sa_name: item.sa_name,
            inclusion_status: included ? 'Включено' : 'Не включено',
            reason: reasons.join(' | '),
            ppvz_for_pay: item.ppvz_for_pay,
            deduction: item.deduction,
            delivery_rub: item.delivery_rub || 0
          });
        }
        const includedRows = tableRows.filter(r => r.inclusion_status === 'Включено');
        const excludedRows = tableRows.filter(r => r.inclusion_status === 'Не включено');
        console.log(`\n=== Отчёт #${realizationreport_id} ===`);
        console.log('--- ВКЛЮЧЕННЫЕ ---');
        console.table(includedRows);
        console.log('--- ИСКЛЮЧЕННЫЕ ---');
        console.table(excludedRows);
      }

      const translatedResults = {};
      for (const [reportId, resultData] of Object.entries(results)) {
        const translatedData = {};
        for (const [key, value] of Object.entries(resultData)) {
          const russianKey = fieldTranslations[key] || key;
          translatedData[russianKey] = value;
        }
        translatedResults[reportId] = translatedData;
      }
      console.log('Итоговые результаты (с переводом ключей):', translatedResults);
    } catch (error) {
      console.error('Ошибка при разборе JSON:', error);
    }
  };
  reader.readAsText(file);
};

input.click();
