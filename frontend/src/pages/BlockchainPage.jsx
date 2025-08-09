import { useState, useEffect } from 'react';
import { 
  Blocks, 
  Search, 
  FileText, 
  Shield, 
  Hash,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import './App.css';

export default function BlockchainPage() {
  const [chainValidations, setChainValidations] = useState([]);
  const [integrityReport, setIntegrityReport] = useState(null);
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { authenticatedFetch } = useAuth();

  const fetchChainValidations = async () => {
    try {
      const response = await authenticatedFetch('/blockchain/chain-validations?limit=20');
      if (response.ok) {
        const data = await response.json();
        setChainValidations(data.data.validations);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchIntegrityReport = async () => {
    try {
      const response = await authenticatedFetch('/blockchain/integrity-report');
      if (response.ok) {
        const data = await response.json();
        setIntegrityReport(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchValidationDetails = async (validationId) => {
    try {
      const response = await authenticatedFetch(`/blockchain/chain-validations/${validationId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedValidation(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des détails');
    }
  };

  const exportReport = async () => {
    try {
      const response = await authenticatedFetch('/admin/export?format=json&days=30');
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cdsec-validator-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Rapport exporté avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchChainValidations(),
        fetchIntegrityReport()
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000); // Actualiser toutes les minutes
    return () => clearInterval(interval);
  }, []);

  const filteredValidations = chainValidations.filter(validation =>
    validation.validation_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    validation.validator_node_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blockchain</h1>
          <p className="text-muted-foreground">
            Exploration et validation de l'intégrité de la blockchain
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAllData} variant="outline">
            Actualiser
          </Button>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Rapport d'intégrité */}
      {integrityReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rapport d'intégrité
            </CardTitle>
            <CardDescription>
              Généré le {new Date(integrityReport.generatedAt).toLocaleString('fr-FR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {integrityReport.summary.integrityScore}%
                </div>
                <p className="text-sm text-muted-foreground">Score d'intégrité</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {integrityReport.summary.totalBlocks}
                </div>
                <p className="text-sm text-muted-foreground">Blocs totaux</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {integrityReport.summary.validBlocks}
                </div>
                <p className="text-sm text-muted-foreground">Blocs valides</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {integrityReport.summary.totalAnomalies}
                </div>
                <p className="text-sm text-muted-foreground">Anomalies</p>
              </div>
            </div>

            {integrityReport.recentActivity.anomaliesLast24h.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Anomalies des dernières 24h</h4>
                <div className="flex flex-wrap gap-2">
                  {integrityReport.recentActivity.anomaliesLast24h.map((anomaly, index) => (
                    <Badge key={index} variant="destructive">
                      {anomaly.anomaly_type}: {anomaly.count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Onglets */}
      <Tabs defaultValue="validations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="validations">Validations de chaîne</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        {/* Validations de chaîne */}
        <TabsContent value="validations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validations de chaîne</CardTitle>
              <CardDescription>Historique des validations de l'intégrité de la blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ID de validation ou nœud..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {filteredValidations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Validation</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Blocs</TableHead>
                      <TableHead>Validateur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredValidations.map((validation) => (
                      <TableRow key={validation.validation_id}>
                        <TableCell className="font-mono text-xs">
                          {validation.validation_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant={validation.is_chain_valid ? "default" : "destructive"}>
                            {validation.is_chain_valid ? "Valide" : "Invalide"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-green-600">{validation.valid_blocks} valides</div>
                            <div className="text-red-600">{validation.invalid_blocks} invalides</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {validation.validator_node_id}
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(validation.validation_timestamp).toLocaleString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => fetchValidationDetails(validation.validation_id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>Détails de la validation</DialogTitle>
                                <DialogDescription>
                                  ID: {validation.validation_id}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedValidation && (
                                <ScrollArea className="h-[60vh]">
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium">Informations générales</h4>
                                        <div className="text-sm space-y-1 mt-2">
                                          <div>Statut: <Badge variant={selectedValidation.is_chain_valid ? "default" : "destructive"}>
                                            {selectedValidation.is_chain_valid ? "Valide" : "Invalide"}
                                          </Badge></div>
                                          <div>Total blocs: {selectedValidation.total_blocks}</div>
                                          <div>Blocs valides: {selectedValidation.valid_blocks}</div>
                                          <div>Blocs invalides: {selectedValidation.invalid_blocks}</div>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Hash de la chaîne</h4>
                                        <div className="text-xs font-mono mt-2 p-2 bg-muted rounded">
                                          {selectedValidation.chain_hash}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {selectedValidation.validation_details && (
                                      <div>
                                        <h4 className="font-medium">Détails de validation</h4>
                                        <div className="mt-2 space-y-2">
                                          {selectedValidation.validation_details.results?.map((result, index) => (
                                            <div key={index} className="p-2 border rounded text-sm">
                                              <div className="flex items-center justify-between">
                                                <span className="font-mono text-xs">Bloc {result.index}</span>
                                                <Badge variant={result.isValid ? "default" : "destructive"}>
                                                  {result.isValid ? "Valide" : "Invalide"}
                                                </Badge>
                                              </div>
                                              {result.error && (
                                                <div className="text-red-600 text-xs mt-1">{result.error}</div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </ScrollArea>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Aucune validation trouvée
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tendances */}
        <TabsContent value="trends" className="space-y-4">
          {integrityReport && integrityReport.recentActivity.validationTrends.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Tendances de validation</CardTitle>
                <CardDescription>Évolution des validations sur les 7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrityReport.recentActivity.validationTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{new Date(trend.date).toLocaleDateString('fr-FR')}</div>
                        <div className="text-sm text-muted-foreground">
                          {trend.total_validations} validations
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-green-600">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          {trend.valid_count}
                        </div>
                        <div className="text-red-600">
                          <XCircle className="h-4 w-4 inline mr-1" />
                          {trend.invalid_count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Aucune donnée de tendance disponible</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

